# Authentication, sessions, and access policy

Read for login, recovery, OAuth, tokens, roles, tenancy or object access. First establish the intended policy; ownership is one possible relationship, not a universal condition for shared, delegated or administrative access.

## Authorization

Build a matrix for the affected operation: actor × action × resource relationship × relevant state. Include allowed and forbidden examples, such as owner, other user, shared collaborator, other tenant, staff and revoked member when they exist.

- Enforce policy at each externally reachable operation and near sensitive data access. Inspect inherited middleware, repository filters and database policies before claiming checks are absent.
- Scope protected queries before returning records, counts or pagination. Validate nested relationships rather than checking a parent and trusting an unrelated child ID.
- Select writable fields explicitly. Unknown fields may be rejected or stripped according to the API contract; never spread a raw request into privileged fields.
- Include exports, bulk writes, downloads, GraphQL resolvers, jobs and cached responses in the affected policy.
- For state-dependent grants, consider the time between check and use and revocation behavior. A stale token or queued job must not silently retain privilege beyond the documented policy.
- Authentication/authorization failure must not grant access. Log a useful redacted diagnostic without exposing resource existence unnecessarily.

A client-supplied tenant ID may be a legitimate selector. Verify membership and permitted actions server-side before accepting it; identity and authority cannot come from the selector alone. Unguessable IDs reduce discovery but do not provide access control.

## Authentication and recovery

Use maintained identity components and review their integration rather than inventing token formats. Choose password hashing from supported password-storage guidance and platform constraints; migrate legacy hashes through a deliberate policy rather than an unsafe bulk rewrite.

Use library verification routines for hashes, signatures and secrets. Where a comparison is security-sensitive, use the appropriate constant-time primitive; handle input lengths as its contract requires. Do not claim ordinary comparisons necessarily expose a remotely exploitable prefix oracle without evidence.

Limit credential attempts using account and network signals without making account lockout an easy denial-of-service tool. Reduce unnecessary account-enumeration differences in response content and processing; exact network timing equality is not a realistic promise.

Recovery tokens need sufficient entropy, limited lifetime, a protected verifier and atomic single use. Generate reset destinations from trusted configuration. Token-bearing links can be legitimate; prevent leakage through logs, analytics, redirects and referrers, and remove tokens from navigation once exchanged. Treat MFA replacement, recovery codes and helpdesk recovery as authentication paths.

Define session revocation after password reset, compromise or privilege change. Do not silently change routine password-change policy without considering the identity provider and existing user experience. Notify owners through an appropriate trusted channel without including sensitive tokens.

## Sessions and tokens

| Mechanism | Verify |
| --- | --- |
| Cookie session | Secure/HttpOnly where appropriate, deliberate SameSite/Domain/Path, CSRF defenses, fixation resistance, expiry and real invalidation |
| Bearer token | Signature or introspection, expected issuer/audience/type, accepted algorithm, required claims and lifetime |
| JWT | Required claims for this protocol; expiry enforcement, nbf when present, bounded clock tolerance and trusted key selection |
| Refresh token | Rotation or sender constraint as appropriate, reuse handling, concurrency behavior and revocation |
| Sensitive operation | Required authentication strength and recency, plus resource authorization |

Do not trust a token's header to select arbitrary algorithms, keys or remote key URLs. Distinguish ID tokens from access tokens. Self-contained access tokens need a revocation strategy if immediate invalidation is required; short expiry alone leaves a revocation window.

Choose browser credential storage against XSS, CSRF, framework and deployment constraints. An HttpOnly cookie reduces direct script theft but does not stop XSS from issuing authenticated actions. Avoid persistent script-readable credentials when a suitable alternative exists.

## OAuth and OpenID Connect

Prefer authorization code flows with PKCE using S256 where supported, including confidential clients following current security guidance. Use a maintained library and bind the callback to the initiating browser transaction; preserve state/nonce protections required by that library and protocol.

Match registered redirect URIs exactly subject to the protocol's specific exceptions, and prevent open-redirect chains. Validate issuer, audience, signature, expiry and applicable nonce on ID tokens. Link identities by verified issuer and subject; email alone is not a universal identity or account-linking policy. Account linking is a sensitive authenticated action.

Check current protocol guidance and provider behavior before implementing refresh rotation, sender constraints or special redirect handling. Do not remove a library's protections because another mechanism appears to overlap them.

## Verification

Use synthetic accounts and objects for allowed/forbidden cases. Exercise the actual route or data policy rather than only its helper. Test membership removal, bulk paths and caches when relevant. Record static policy reasoning separately from observed responses; neither a matrix cell nor a scanner warning becomes a finding until intended and actual policy differ.

## Primary references

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): policy design and enforcement.
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html): authentication and recovery controls.
- [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html): current OAuth security best practice; consult the applicable section and provider contract.
