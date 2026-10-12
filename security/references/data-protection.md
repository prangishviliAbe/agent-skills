# Data protection and cryptographic lifecycle

Read when: Handling passwords, encryption, signatures, tokens, sessions, or sensitive logging.

| Area | Decision |
| --- | --- |
| Passwords | Prefer maintained Argon2id support; calibrate memory/time against current guidance and deployment load |
| Existing hashes | Verify using encoded parameters; rehash on successful login according to migration policy |
| Encryption | Use maintained authenticated encryption and key management; define nonce uniqueness and rotation |
| Keys | Keep outside source/control-plane logs; validate lengths; define access and revocation |
| Signatures | Use provider verifier over raw data and required replay/timestamp checks |
| Tokens | High-entropy generation, secure storage, bounded lifetime, revocation where needed |
| Sessions | Secure/HttpOnly/SameSite policy as appropriate; CSRF/origin safeguards for cookie-authenticated mutations |
| Logging | Redact sensitive values and bound attacker-controlled content |

Check [OWASP password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) rather than treating one hash cost as universally correct. Existing provider-managed authentication may be preferable to a custom implementation. Legacy bcrypt requires its input-length and work-factor constraints; do not silently truncate passwords.

For AES-GCM, nonce reuse under the same key is catastrophic. Use a supported lifecycle with unique nonces, authentication tags, versioned keys, and no plaintext release before authentication succeeds. One encrypt-only snippet is not a complete storage design.

## Fixed-format signature comparison

```javascript
import { timingSafeEqual } from 'node:crypto';

export function equalSha256Hex(provided, expected) {
  const valid = value => typeof value === 'string' && /^[0-9a-f]{64}$/i.test(value);
  if (!valid(provided) || !valid(expected)) return false;
  const actualBytes = Buffer.from(provided, 'hex');
  const expectedBytes = Buffer.from(expected, 'hex');
  return timingSafeEqual(actualBytes, expectedBytes);
}
```

This compares two already computed SHA-256 hex signatures. It does not authenticate a webhook by itself. Use the provider's defined algorithm, payload, timestamp policy, encoding, and key source. Equal byte lengths are a precondition for timingSafeEqual; ordinary equality on secret bytes is insufficient.

## Verification artifact

```text
Valid signature: accepted.
Same-length wrong signature: rejected.
Malformed encoding or wrong length: rejected without exception.
Modified payload / expired provider timestamp: rejected by full verifier.
Key rotation and session revocation: exercised if changed.
Sensitive logs: inspected with synthetic values.
```
