# Authentication, sessions, tokens, and access control

Read for login, passwords, recovery, sessions, tokens, OAuth, roles, tenancy, or object access. Establish the intended policy first: ownership is one relationship among several (shared, delegated, role-based, administrative), and a request that "works" is not evidence of the policy.

## 1. Write the policy as a matrix

Cover actor, action, resource relationship, and state. Include forbidden examples, and derive tests from the matrix.

| Actor | Read invoice | Edit invoice | Refund |
| --- | --- | --- | --- |
| Creator, same tenant | yes | only while draft | no |
| Teammate, same tenant | yes | no | no |
| Finance role | yes | no | yes, up to the captured amount |
| Other tenant | no (404) | no | no |
| Signed out | no (401) | no | no |
| Revoked member | no | no | no |

A client-supplied tenant id can be a legitimate selector, but membership and permitted actions are verified on the server; identity and authority never come from the selector. Unguessable ids reduce discovery and are not access control.

## 2. Enforce it where the data is touched

- Put the decision in one policy function and call it from the data layer, so routes, jobs, exports, and resolvers share it. Deny by default.
- Scope the query by owner or tenant before returning records, counts, or pagination. Check nested relationships through a join, not by trusting a child id after checking its parent.
- Select writable fields explicitly. Reject or strip unknown fields; never spread a raw request into a privileged update.
- Re-check authorization when a queued job runs, and carry the requester's scope in cached or derived outputs. A stale token or queued job must not keep privilege past the documented policy.
- An authorization or authentication failure must never grant access. Log a redacted diagnostic and avoid revealing resource existence when that matters.

```ts
// policy.ts: one place that answers "may this actor do this to this resource?"
export type Actor = { id: string; tenantId: string; roles: ReadonlySet<'member' | 'finance' | 'admin'> };
export type Invoice = { id: string; tenantId: string; createdBy: string; status: 'draft' | 'sent' | 'paid' };

export const can = {
  readInvoice: (actor: Actor, invoice: Invoice) => invoice.tenantId === actor.tenantId,
  editInvoice: (actor: Actor, invoice: Invoice) =>
    invoice.tenantId === actor.tenantId &&
    invoice.status === 'draft' &&
    (invoice.createdBy === actor.id || actor.roles.has('admin')),
  refundInvoice: (actor: Actor, invoice: Invoice) =>
    invoice.tenantId === actor.tenantId && invoice.status === 'paid' && actor.roles.has('finance'),
};
```

```ts
// data layer: scope first (a missing and a foreign invoice look the same), then apply the policy
export async function editInvoice(actor: Actor, id: string, patch: InvoicePatch) {
  const invoice = await db.invoice.findFirst({ where: { id, tenantId: actor.tenantId } });
  if (!invoice || !can.editInvoice(actor, invoice)) return { ok: false as const, code: 'not_found' };
  return { ok: true as const, invoice: await db.invoice.update({ where: { id }, data: patch }) };
}
```

A comment must belong to the post in the URL, and that post to the caller's tenant:

```sql
SELECT c.*
FROM comments c
JOIN posts p ON p.id = c.post_id
WHERE c.id = $1 AND c.post_id = $2 AND p.tenant_id = $3;
```

Make privileged fields unreachable from the request by leaving them out of the schema:

```ts
const ProfilePatch = z.object({
  displayName: z.string().trim().min(1).max(80),
  bio: z.string().max(500).optional(),
}).strict(); // role, tenantId, and emailVerified cannot be set from a request
```

Where checks live, and the usual gap:

| Framework | Enforcement point | Typical gap |
| --- | --- | --- |
| Express, Fastify, Hono | Per-route middleware or a policy call in the handler | New route added without the middleware; middleware ordering |
| Next.js | Data access layer plus every Server Action and route handler; `proxy.ts` only for optimistic checks | Relying on a layout redirect, page check, or proxy |
| Django, DRF | `permission_classes`, `has_object_permission`, scoped `get_queryset` | `AllowAny` default, unscoped queryset, `csrf_exempt` |
| Laravel | Policies and gates, `authorize()`, route middleware | `$request->all()` mass assignment; missing `authorize` |
| Rails | Pundit or CanCan, `before_action`, strong parameters | `skip_before_action`, `permit!` |
| Spring | `@PreAuthorize`, method security, `SecurityFilterChain` | `permitAll()` matcher order; method security not enabled |
| ASP.NET | `[Authorize]` and a fallback policy | `[AllowAnonymous]`; unscoped Entity Framework queries |
| GraphQL | Resolver and field-level checks | Authorization only on root fields; batching and alias abuse |

## 3. Authentication

### Passwords

- Prefer passkeys (WebAuthn) or a managed identity provider. Where passwords remain, require MFA for anything sensitive.
- Policy (NIST SP 800-63B-4): at least 15 characters when the password is the only factor (8 with MFA), accept at least 64 characters, allow spaces and Unicode, impose no composition rules, never force periodic rotation, and reject known-breached or common passwords.
- Storage: Argon2id with at least 19 MiB memory, 2 iterations, 1 lane (OWASP minimum; equivalent trade-offs are 12 MiB with 3, 9 MiB with 4, 7 MiB with 5). Treat that as a floor and raise it to your latency and concurrency budget. If Argon2id is unavailable use scrypt (N=2^17, r=8, p=1), or bcrypt with cost 10 or more (it ignores input beyond 72 bytes). Use PBKDF2-HMAC-SHA-256 with 600,000 or more iterations only when FIPS compliance requires it.
- Store the parameters with the hash and rehash at the next successful login when they are outdated. Migrate legacy hashes at login, not by a bulk rewrite.

Node 24.7 and later include Argon2 in `node:crypto`. Elsewhere use a maintained library: `argon2-cffi` (`PasswordHasher`, `check_needs_rehash`) for Python, `password_hash($password, PASSWORD_ARGON2ID)` with `password_verify` and `password_needs_rehash` for PHP, `golang.org/x/crypto/argon2` for Go, `Argon2PasswordEncoder` in Spring Security.

```ts
import { argon2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const argon2Async = promisify(argon2);
const PARAMS = { memory: 19456, passes: 2, parallelism: 1, tagLength: 32 }; // memory in KiB; OWASP minimum

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const tag = await argon2Async('argon2id', { message: password.normalize('NFKC'), nonce: salt, ...PARAMS });
  return ['argon2id', PARAMS.memory, PARAMS.passes, PARAMS.parallelism, salt.toString('base64'), Buffer.from(tag).toString('base64')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, memory, passes, parallelism, salt, hash] = stored.split('$');
  if (algorithm !== 'argon2id') return false;
  const expected = Buffer.from(hash, 'base64');
  const actual = Buffer.from(await argon2Async('argon2id', {
    message: password.normalize('NFKC'),
    nonce: Buffer.from(salt, 'base64'),
    memory: Number(memory),
    passes: Number(passes),
    parallelism: Number(parallelism),
    tagLength: expected.length,
  }));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
```

Scrypt in Node needs `maxmem` above the 32 MiB default for the OWASP parameters (`{ N: 2 ** 17, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }`); without it the call throws `ERR_CRYPTO_INVALID_SCRYPT_PARAMS`.

Login behavior: return the same message and do comparable work for an unknown user and a wrong password (hash a dummy value for unknown users), limit attempts per account and per source without making hard lockout an easy denial of service, and throttle MFA attempts. Exact timing equality is not a realistic promise; reduce the obvious differences.

### Recovery tokens

Recovery paths (reset links, MFA reset, recovery codes, helpdesk) are authentication paths and need the same strength as the password.

- Generate with a cryptographic source (`randomBytes(32).toString('base64url')`), store only a hash, give it a short life, and make single use atomic:

```sql
UPDATE password_resets
SET used_at = now()
WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
RETURNING user_id;
```

Zero rows means unknown, used, or expired. After a successful reset, revoke existing sessions and notify the owner through a trusted channel without including the token.
- Build the link from configured trusted origins, never from the request `Host` header (host-header poisoning sends the token to the attacker's domain).
- A token in a URL can leak through logs, analytics, referrers, and redirects. Set `Referrer-Policy: no-referrer` on that page, exchange the token for server state, and remove it from the address bar.

### Sessions

- Cookie sessions: `Set-Cookie: __Host-sid=<random>; Path=/; Secure; HttpOnly; SameSite=Lax`, with no `Domain` attribute so the cookie stays host-only. Use an opaque id of at least 128 random bits and a server-side store.
- Rotate the id at login and on privilege change, enforce idle and absolute timeouts, and make logout and password change invalidate sessions on the server.
- `SameSite=Lax` blunts much cross-site request forgery but is not a complete defense; see [injection.md](injection.md) for Origin and Fetch Metadata checks.
- Self-contained stateless tokens cannot be revoked before expiry. For browser sessions prefer server-side sessions; if you use tokens, keep them short-lived with rotating refresh tokens.
- Do not store credentials in `localStorage`. An HttpOnly cookie hides the value from script but does not stop XSS from issuing authenticated requests.

### Tokens (JWT and bearer)

Verify with a maintained library and pin everything the token could otherwise choose: algorithm, issuer, audience, and key source. Never take the algorithm, `jku`, `x5u`, or an embedded `jwk` from the token header. ID tokens are not access tokens, and a JWT payload is readable, so keep secrets out of it.

```ts
import { createRemoteJWKSet, jwtVerify } from 'jose';

const jwks = createRemoteJWKSet(new URL('https://issuer.example/.well-known/jwks.json'));

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: 'https://issuer.example',
    audience: 'my-api',
    algorithms: ['RS256'], // an allowlist rejects `none` and HMAC key-confusion tokens
    clockTolerance: 5,     // seconds
  });
  return payload; // then check scopes and `sub` against your policy
}
```

Refresh tokens: rotate on every use, detect reuse and revoke the whole family, store them hashed, and revoke on logout. API keys: at least 32 random bytes, a visible prefix to identify them, stored hashed, scoped, expirable, shown once, and rotatable.

### OAuth and OpenID Connect (as the client)

Use the authorization code flow with PKCE (S256) for every client type, a `state` bound to the initiating browser session, an OIDC `nonce`, and exact-match registered redirect URIs. Avoid the implicit and password grants. Validate ID tokens (signature, `iss`, `aud`, `exp`, `nonce`). Link accounts by issuer plus subject, never by email alone, and require authentication to the existing account before linking. Guard `redirect_uri` and any post-login `next` parameter against open redirects. Follow RFC 9700 and the provider's current documentation, and do not remove a library's protections because another mechanism seems to overlap.

### MFA

Require recent authentication to enroll or change factors. Store recovery codes hashed and single-use. Rate-limit code attempts. Prefer WebAuthn over TOTP, and TOTP over SMS (SIM swapping). Use step-up authentication for sensitive operations, checking when the user last authenticated.

## 4. Verify

Use synthetic accounts and objects for allowed and forbidden cases. Exercise the real route or data function, not only a helper. Test membership removal and role downgrade, token expiry and revocation, password reset invalidating sessions, replay of a used reset token, another tenant's ids on every route, and the bulk, export, job, and cache paths. Record static reasoning separately from observed responses; a matrix cell or scanner warning becomes a finding only when intended and actual policy differ.

## Primary references

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [RFC 9700, OAuth 2.0 security best current practice](https://www.rfc-editor.org/rfc/rfc9700.html) and [RFC 8725, JWT best current practices](https://www.rfc-editor.org/rfc/rfc8725.html)
- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html), digital identity authentication guidelines
