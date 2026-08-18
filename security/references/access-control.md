# Authentication, sessions, and authorization

Read when reviewing or building login, sessions, tokens, roles, ownership, or tenancy. This is where the most damaging real-world flaws live.

## Authorization: the checklist that catches most breaches

- [ ] Every protected route **and** every protected object has a server-side check.
- [ ] The check tests **both** capability ("may this role do this?") and **relationship** ("does this record belong to this actor?").
- [ ] Queries are scoped in the database (`WHERE tenant_id = :actor_tenant`), not filtered in application code after a broad read.
- [ ] Deny by default: a new route without an explicit policy is inaccessible.
- [ ] The check runs on the server for every entry point to the same operation: REST, GraphQL, server action, admin panel, CLI, job, and export.
- [ ] Errors and timeouts in the authorization path result in denial.
- [ ] Write endpoints reject unknown fields, so `role`, `price`, `ownerId`, `isVerified`, and `status` cannot be smuggled in.
- [ ] Bulk and export endpoints apply the same per-object rules as the single-record endpoint.
- [ ] Aggregate endpoints (counts, search suggestions, autocompletes) do not leak the existence of records the actor cannot read.

**The two escalation shapes to test explicitly:**

- *Horizontal:* log in as user A, request user B's identifier directly. Try it on every endpoint that takes an ID, including PATCH, DELETE, and nested resources.
- *Vertical:* as a low-privilege user, call an admin endpoint directly, without the UI. Also try the admin endpoint's underlying API, its GraphQL field, and its export variant.

**Identifiers are not secrets.** Sequential IDs make enumeration trivial, but unguessable IDs are not access control either — they only slow discovery. Fix the check, and use non-sequential IDs as an additional measure.

## Authentication

- Use the framework's or platform's maintained authentication rather than a hand-rolled one. Custom auth is the single highest-yield place for a mistake.
- Store passwords with a modern memory-hard hash at current parameters. Never a fast hash, never encryption, never a home-made scheme.
- Compare secrets in constant time. Ordinary string comparison leaks length and prefix through timing.
- Rate limit and progressively delay login, password reset, one-time-code verification, and any endpoint that reveals whether an account exists.
- Return identical responses and timing for "unknown account" and "wrong password", and for reset requests regardless of whether the address exists.
- Offer second-factor authentication where the risk justifies it, and cover the recovery path with the same rigor — recovery is the usual bypass.

**Password reset, the most-abused flow:**

- Single-use, short-lived, high-entropy token, stored hashed, invalidated on use and on password change.
- Never place the token in a redirect, a referrer-leaking URL, or an analytics payload.
- Invalidate all other sessions after a password change, and notify the account owner.
- Do not reveal existence of the account through the reset response, timing, or a differing error.

## Sessions and tokens

**Cookie sessions (preferred for browsers):**

- `HttpOnly`, `Secure`, and a deliberate `SameSite` value. `Lax` for typical apps; `None` requires `Secure` and an explicit reason.
- Rotate the session identifier on login and on any privilege change, to defeat fixation.
- Set both an idle timeout and an absolute lifetime. Provide real server-side logout that invalidates the record, not merely a cookie delete.
- Bind sensitive operations to a recent re-authentication.

**Bearer tokens and JWTs:**

- Verify signature, algorithm (against an expected allowlist, never taken from the header), issuer, audience, expiry, and not-before. Reject `none` and reject an unexpected algorithm family.
- Keep access tokens short-lived and design refresh with rotation and reuse detection.
- A JWT cannot be revoked by itself. If you need revocation, keep a server-side session or a denylist, and say so in the design.
- Do not put personal data or authorization decisions in a token the client can read and cache indefinitely; claims go stale after a permission change.
- Avoid storing tokens in `localStorage` when a secure cookie session is viable: any XSS becomes full account takeover with a persistent credential.

## Multi-tenancy

- The tenant identifier comes from the server-side session, never from a request header, body field, or path segment the client controls.
- Enforce the scope in one place — a repository layer, a query scope, or row-level security — rather than repeating a `WHERE` clause the next developer will forget.
- Test cross-tenant access on every endpoint that accepts an identifier, plus search, export, file download, and webhook callbacks.
- Shared caches, background jobs, and file storage paths must carry the tenant scope too. A cache key without the tenant is a cross-tenant read.

## OAuth and third-party sign-in

- Validate the `state` parameter to prevent CSRF on the callback, and use PKCE for public clients.
- Register exact redirect URIs. Wildcards and open redirects turn into token theft.
- Verify the ID token's signature, issuer, audience, nonce, and expiry. Never trust profile data from an unverified source.
- Match accounts on a verified, provider-stable subject identifier. Matching on an email address alone allows takeover when a provider does not verify emails.

## Rate limiting and abuse

Apply limits keyed by both identity and network origin, on: login, registration, password reset, verification codes, search, file upload, export, expensive computations, and any endpoint that sends an email or an SMS on demand.

Return `429` with a `Retry-After`, and make sure the limiter fails closed if its backing store is unavailable — an outage should not remove the brakes on credential stuffing.

## Verification recipe

For an authorization audit, work through a matrix rather than reading code randomly:

```
rows    = every endpoint that accepts an object identifier
columns = anonymous | user-owner | user-other | other-tenant | staff | admin
cells   = expected outcome (200 / 403 / 404) vs observed
```

Fill the matrix by tracing the code, or by testing with disposable accounts in an environment you are authorized to test. Every mismatch is a finding.
