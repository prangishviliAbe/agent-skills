# Files, cryptography, and personal data

Read when handling uploads, downloads, encryption, tokens, personal data, logging, or retention.

## File uploads

Validate in this order and reject early:

1. **Size**, before reading the whole file into memory. Enforce it at the proxy or web server too, not only in application code.
2. **Extension**, against an allowlist. Never a denylist: `.php5`, `.phtml`, `.svg`, `.htaccess`, and double extensions all get through a denylist.
3. **Detected content type from the bytes**, not the client-supplied `Content-Type` header, which is attacker-controlled.
4. **Structural validity** — actually parse it as the claimed type. A file that is a valid JPEG parses as a JPEG.

Storage rules:

- Store outside the web root, or in object storage, and serve through an application route that applies authorization.
- Generate the stored filename yourself (a random identifier). Keep the user's name only as a display label, escaped at output.
- Never allow the upload directory to execute code. Where the platform allows, disable script execution at the server level as well.
- Re-encode images where feasible: it strips embedded payloads and metadata in one step.
- SVG is executable content. Sanitize it with an SVG-aware sanitizer or serve it with a content type and disposition that prevents inline rendering.
- Archives: cap the entry count, the total decompressed size, and the compression ratio, and reject entries whose resolved path escapes the extraction directory.

Serving rules:

- Set `Content-Type` explicitly and `X-Content-Type-Options: nosniff`.
- Use `Content-Disposition: attachment` for anything not intended to render inline.
- Serve user content from a separate origin when possible, so a stored HTML payload cannot reach your session cookies.
- Authorize on the object, and make direct or pre-signed URLs short-lived and scoped.

## Cryptography

- Use a maintained library at a modern default. Never design a scheme, a mode, or a padding.
- Encryption for confidentiality means authenticated encryption. Encryption without integrity permits tampering.
- Never reuse a nonce or an initialization vector with the same key. Generate randomly per operation from a cryptographically secure source.
- Random values used for security (tokens, identifiers, salts, reset codes) come from a CSPRNG, never from a general-purpose random function.
- Passwords are hashed with a memory-hard algorithm, never encrypted. Encryption implies you can recover them, which is the wrong property.
- Hashing is not encryption, encoding is not encryption, and base64 is not a security control.
- Key management is the hard part: keys live in a secret manager, are separated from the data they protect, are scoped per environment, and have a rotation plan that includes re-encrypting or versioning existing ciphertext.
- Compare secrets, signatures, and tokens with a constant-time function.

## Personal data

- **Collect the minimum.** Every field you do not store cannot be leaked.
- Classify what you hold: identifiers, contact details, financial data, government identifiers, health data, location, biometrics, and anything about children. The classification determines the controls and the legal obligations.
- Encrypt sensitive fields at rest when the threat model includes database access, and always encrypt in transit.
- Define retention per data class and enforce it with a scheduled deletion job, not a policy document. Include backups, exports, logs, analytics, and third-party processors in the deletion path.
- Support access and deletion requests as a real, tested code path.
- Third parties are part of your surface: know what each analytics script, session recorder, error tracker, and support widget receives. Session recording tools capture form contents unless explicitly masked.

## Logging and telemetry

Never log: passwords, tokens, session identifiers, API keys, full card numbers, security answers, one-time codes, raw request bodies of authentication endpoints, or personal data beyond what the log's purpose requires.

Do log, in structured form: who acted, what they acted on, when, from where, and the outcome — especially for authentication events, permission changes, admin actions, exports, and deletions. An audit trail is what turns an incident into a bounded, explainable event.

Protect the logs themselves: access-controlled, retention-limited, and tamper-evident for the audit-relevant subset. Log injection is real — encode newlines and control characters from untrusted values before writing them.

## Error handling

- Users get a stable, non-descriptive message plus a correlation ID.
- Operators get the full detail server-side, keyed by that same ID.
- Debug modes, stack traces, SQL, framework version banners, and directory listings must be off in production. Verify by requesting a deliberately broken URL and reading what comes back.
- Do not let error differences become an oracle: distinct messages or timings for "user not found" versus "wrong password" leak account existence.

## Backups

A backup contains everything the production database contains, usually with fewer controls. Encrypt it, restrict access to it, keep it out of publicly reachable storage, and test the restore. Deletion obligations apply to backups too — document how a deletion request eventually reaches them.
