# Files, cryptography, sensitive data, and logs

Read for uploads/downloads, encryption, credentials, personal data or telemetry. Define what the control must protect and from whom before choosing a mechanism.

## File lifecycle

Validate size before buffering, allow permitted types, and compare extension, reported media type and detected structure. None alone proves safety. Run parsers with resource limits and isolation appropriate to the format; a valid file can still exploit a vulnerable decoder or expand dramatically.

Generate storage identifiers instead of accepting paths. Prevent script execution in upload storage. Authorize private upload, read and delete operations; public content may use deliberately public storage with a safe serving policy.

For images, re-encoding can remove some embedded content and metadata, but is not a complete sanitizer or parser-exploit defense. Treat SVG, HTML and active document formats according to their rendering context: use format-aware sanitization, isolated serving or attachment delivery as appropriate. Do not silently destroy required vector or document features to claim safety.

For archives, bound entry count, expanded bytes and processing time; reject traversal, unsafe symlinks and entries escaping the extraction root. A compression-ratio cap alone does not stop every resource-exhaustion case.

When serving, set a correct media type and content disposition, with nosniff where supported. Separate untrusted content from the application origin and ambient cookies; consider same-site and cookie Domain behavior too. A signed URL is a bearer grant: constrain object, operation and lifetime and assess revocation requirements. Never make it long-lived simply to avoid authorization on subsequent requests.

## Cryptographic design

Prefer maintained high-level APIs that provide authenticated encryption and safe defaults. Select algorithms and parameters from current platform guidance and relevant compliance constraints; do not invent schemes or copy parameters from unrelated algorithms.

Follow the chosen algorithm's nonce/IV requirements, including length, uniqueness, unpredictability and message limits. Some modes use counters and others random values; a universal random-IV rule is wrong. Prevent reuse across restarts and multiple writers when uniqueness is required. Use a cryptographic random source for secrets and tokens.

Use password-hashing APIs for passwords, not reversible encryption or fast general-purpose hashes. Authenticate encrypted data before using plaintext. Use supported verification functions and key identifiers/versioning; do not silently fall back to an insecure mode on failure.

Keep keys separate from protected data with scoped access. Define rotation and old-key retirement against existing ciphertext and backup needs. Encryption at rest mitigates some disk/backup exposures; it does not stop a compromised service that can both read data and request decryption.

## Data minimization and retention

Identify necessary data, access roles, third-party recipients and retention requirements. Do not invent legal obligations or promise compliance from a technical checklist. Legal holds, jurisdiction and backup architecture may require policy input.

Map retention to working records, exports, logs, caches, processors and backups. Where immutable backups expire rather than allowing individual deletion, document expiry/access rules and how deletion is reapplied after restore. Preserve required audit evidence without retaining unnecessary content.

Inspect analytics and session-replay configuration for actual capture/masking behavior. Do not assume all products record or protect the same fields. Use synthetic values for verification rather than submitting real sensitive information to a third party.

## Logs and errors

Record safe event metadata: actor identifier as appropriate, action, resource identifier, timestamp, decision and correlation ID. Avoid passwords, tokens, credential-bearing URLs, raw authentication bodies and unnecessary personal content. Redact at collection as well as presentation; output masking does not remove a value already sent to telemetry.

Use structured logging and safe handling of untrusted control characters. Restrict access, set retention and protect audit-relevant records from tampering. Collect only the diagnostic detail required for the question.

Give users useful safe messages and field guidance; give operators redacted diagnostics. Distinguish authentication failures consistently where enumeration matters, without hiding every actionable validation error. Verify production error responses and debug exposure with authorized low-impact checks.

## Primary references

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html): layered validation, storage and serving controls.
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html): algorithm selection and key-management considerations.
