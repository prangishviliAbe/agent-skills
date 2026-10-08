# Cryptography & Data Protection Standards

Read when: You are hashing passwords, encrypting data at rest, comparing secret tokens, or generating secure random identifiers.

---

## 1. Password Hashing: Argon2id

Argon2id is the winner of the Password Hashing Competition, resisting GPU cracking through memory hardness:

```typescript partial
import * as argon2 from 'argon2';

export async function hashPassword(plainText: string): Promise<string> {
  return await argon2.hash(plainText, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,         // 3 iterations
    parallelism: 1,
  });
}

export async function verifyPassword(hash: string, plainText: string): Promise<boolean> {
  return await argon2.verify(hash, plainText);
}
```

---

## 2. Symmetric Encryption: AES-256-GCM

Always use authenticated encryption (AEAD) to detect tampering:

```typescript partial
import crypto from 'node:crypto';

export function encryptPayload(text: string, secretKey: Buffer): { iv: string; ciphertext: string; tag: string } {
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', secretKey, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    ciphertext: encrypted,
    tag: tag,
  };
}
```

---

## 3. Timing-Safe Comparisons

Prevent side-channel timing attacks when validating webhook signatures or API tokens:

```typescript partial
import crypto from 'node:crypto';

export function verifyApiToken(providedToken: string, expectedToken: string): boolean {
  const a = Buffer.from(providedToken);
  const b = Buffer.from(expectedToken);

  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}
```
