# Files, cryptography, secrets, privacy, and logs

Read for uploads and downloads, encryption and signing, secret handling, personal data, retention, and telemetry. Define what the control must protect and from whom before choosing a mechanism. The cryptographic snippets here were executed against tampered, truncated, and mismatched inputs.

## File lifecycle

- **Limit before you buffer.** Enforce size, count, and (for images) pixel dimensions while streaming, and bound decoder time and memory. A small valid file can still expand enormously or exploit a vulnerable decoder.
- **Do not trust one signal.** Compare the extension, the declared media type, and the detected content (magic bytes); none alone proves safety. Allow only the types the feature needs.
- **Generate storage names.** Never build a path from a client filename. Store metadata in the database, and keep uploads out of any directory that can execute code.
- **Authorize every operation.** Private uploads need authorization on read, replace, and delete. Public content may live in deliberately public storage with a safe serving policy.
- **Treat active formats as code.** SVG, HTML, PDF, and Office documents can carry script. Sanitize with a format-aware tool, serve as an attachment, or serve from an isolated origin. Re-encoding an image strips some embedded content and metadata (including EXIF location), but it is not a sanitizer and does not make a parser safe.
- **Serve safely.** Set a correct `Content-Type`, `Content-Disposition` (attachment for untrusted types), and `X-Content-Type-Options: nosniff`. Serve untrusted content from a separate origin with no ambient cookies. A signed URL is a bearer grant: constrain the object, the operation, and a short lifetime, and decide how it is revoked.
- **Archives:** cap entry count, expanded bytes, depth, and time; reject path traversal, absolute paths, and symlink or hardlink entries (see the path-containment helper in [injection.md](injection.md)). A compression-ratio limit alone does not stop every exhaustion case.

A signed grant that binds object, operation, and expiry, with a constant-time comparison:

```ts
import { createHmac, timingSafeEqual } from 'node:crypto';

type Operation = 'get' | 'put';

export function signGrant(secret: Buffer, objectId: string, operation: Operation, expiresAtMs: number): string {
  return createHmac('sha256', secret).update(`${operation}\n${objectId}\n${expiresAtMs}`).digest('base64url');
}

export function verifyGrant(
  secret: Buffer, objectId: string, operation: Operation, expiresAtMs: number, signature: string,
): boolean {
  if (!Number.isFinite(expiresAtMs) || Date.now() > expiresAtMs) return false;
  const expected = Buffer.from(signGrant(secret, objectId, operation, expiresAtMs));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
```

## Cryptography

- Use maintained high-level APIs (libsodium, Tink, WebCrypto, the platform's AEAD) and current guidance for algorithms and parameters. Do not invent a scheme or copy parameters from an unrelated algorithm.
- **Encryption:** an authenticated mode (AES-256-GCM, ChaCha20-Poly1305). Authenticate before using plaintext. Bind ciphertext to its context with associated data (user id, record id) so a valid ciphertext cannot be moved to another record.
- **Nonces:** follow the algorithm's rule, which differs by mode. For AES-GCM, a nonce must never repeat under one key; random 96-bit nonces are acceptable up to about 2^32 messages per key, after which rotate the key or use a construction designed for it. Prevent reuse across restarts and multiple writers. There is no universal "random IV" rule.
- **Randomness:** only a cryptographic source for tokens, keys, and ids that must be unguessable.

| Runtime | Secure token |
| --- | --- |
| Node | `crypto.randomBytes(32).toString('base64url')` |
| Python | `secrets.token_urlsafe(32)` |
| PHP | `bin2hex(random_bytes(32))` |
| Go / Java | `crypto/rand` / `SecureRandom` |

Never `Math.random()`, `rand()`, timestamps, or UUIDv1 for secrets.

- **Passwords:** a password-hashing function (Argon2id), never reversible encryption or a fast hash. Parameters are in [access-control.md](access-control.md).
- **Keys:** keep them separate from the data they protect, in a KMS or secret manager, with scoped access, identifiers for rotation, and a retirement plan that covers existing ciphertext and backups. Envelope encryption (a data key wrapped by a KMS key) keeps bulk data out of the KMS. Encryption at rest mitigates stolen disks and backups; it does not stop a compromised service that can request decryption.
- **TLS:** verify certificates and hostnames everywhere. `rejectUnauthorized: false`, `verify=False`, `InsecureSkipVerify`, and `NODE_TLS_REJECT_UNAUTHORIZED=0` are findings unless confined to a test fixture.

An AEAD helper with key identifiers, associated data, and a pinned tag length (without `authTagLength`, Node accepts truncated GCM tags):

```ts
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

// 32-byte keys from a KMS or secret manager, identified by id so keys can rotate.
export type KeyRing = { current: string; keys: Map<string, Buffer> };

export function encrypt(ring: KeyRing, plaintext: string, aad: string): string {
  const key = ring.keys.get(ring.current);
  if (!key) throw new Error('current key missing');
  const nonce = randomBytes(12); // random 96-bit nonce is fine up to about 2^32 messages per key
  const cipher = createCipheriv('aes-256-gcm', key, nonce);
  cipher.setAAD(Buffer.from(aad, 'utf8')); // binds the ciphertext to its context
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [ring.current, nonce.toString('base64url'), ciphertext.toString('base64url'), tag.toString('base64url')].join('.');
}

export function decrypt(ring: KeyRing, token: string, aad: string): string {
  const [keyId, nonce, ciphertext, tag] = token.split('.');
  const key = keyId ? ring.keys.get(keyId) : undefined;
  if (!key || !nonce || !ciphertext || !tag) throw new Error('invalid token');
  // authTagLength pins the tag size; without it Node accepts truncated GCM tags
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(nonce, 'base64url'), { authTagLength: 16 });
  decipher.setAAD(Buffer.from(aad, 'utf8'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64url')), decipher.final()]).toString('utf8');
}
```

## Secrets

- Keep secrets in the platform's secret store or a secret manager, injected as environment variables or files at run time. Never in the repository, container image layers (use build secrets), client bundles, URLs (they land in logs and referrers), or command-line arguments (visible in process listings).
- Prefer short-lived credentials from workload identity or OIDC over long-lived keys, and give each credential the least privilege its job needs. A mobile or browser application cannot hide a secret, so design the backend not to depend on one.
- Scan for committed secrets in CI and in a pre-commit hook. Treat a credible exposure as a rotation event; the steps are in [supply-chain.md](supply-chain.md).

## Personal data and retention

- Identify necessary data, the roles that can access it, third-party recipients, and retention requirements. Collect less.
- Map retention across working records, exports, logs, caches, analytics, processors, and backups. Where immutable backups expire rather than allowing per-record deletion, document the expiry and how deletion is reapplied after a restore.
- Inspect analytics and session-replay products for what they actually capture and mask; products differ. Use synthetic values when verifying, not real personal information sent to a third party.
- Do not invent legal obligations or promise compliance from a technical checklist. Jurisdiction, legal holds, and contracts may need policy input.

## Logs and errors

- Log security events with enough to investigate: actor, action, resource id, outcome, time, correlation id. Cover sign-in and failures, MFA changes, password resets, authorization denials, privilege changes, administrator actions, and exports.
- Never log passwords, tokens, session ids, full card numbers, or request and response bodies by default. Redact at collection, because masking at display does not remove a value already shipped to a telemetry vendor.

```ts
import pino from 'pino';

export const logger = pino({
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]', '*.password', '*.token', '*.secret'],
    censor: '[redacted]',
  },
});
```

- Use structured logging, neutralize CR and LF in untrusted values, restrict access, set retention, and protect audit records from tampering (append-only or shipped off the host).
- Give users a safe message and a code; give operators the redacted diagnostics. Keep authentication failures consistent where enumeration matters, without hiding actionable validation errors. Confirm production responses expose no stack traces or debug pages with an authorized, low-impact check.

## Primary references

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
