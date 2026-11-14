# Web vulnerability classes

Read when: Reviewing or fixing injection, XSS, CSRF, open redirects, file uploads, authentication flows, or WordPress code.

Each class below gives the pattern to look for, the fix that holds, and how to verify it. Framework behavior varies by version; confirm defaults against the installed version's documentation.

## Injection

| Sink | Vulnerable pattern | Fix |
| --- | --- | --- |
| SQL | String concatenation or template interpolation into a query; raw-query helpers with interpolated values | Parameterized queries or the ORM's bound parameters |
| SQL identifiers | Column or table name, sort direction, or `LIMIT` built from input | Map input to an allowlist of known identifiers; parameters cannot bind identifiers |
| Shell | `exec` or `system` with an interpolated string | Argument-array APIs without a shell; allowlist the command; never pass user input as a flag position without `--` |
| File path | User input joined into a path | Resolve the final path and confirm it stays inside the intended directory; reject on mismatch; beware symlinks |
| Templates | User input used as a template, not as template data | Treat input as data only; sandbox is not a boundary |
| NoSQL | Request body passed directly as a query object, allowing operator injection | Validate types; reject objects where strings are expected |
| Deserialization | Unserializing untrusted data with a format that can instantiate objects (PHP `unserialize`, Python `pickle`, Java native) | Use a data-only format such as JSON with schema validation |
| Regex | User-supplied pattern, or a catastrophic pattern on user input | Bound length; avoid nested quantifiers; use a linear-time engine where available |
| HTTP headers and logs | Input containing line breaks written to a header or log line | Strip or encode control characters |

```typescript partial
// Vulnerable: identifier from input
const rows = await sql.unsafe(`SELECT * FROM shipments ORDER BY ${req.query.sort}`);

// Fixed: allowlist identifiers, bind values
const SORTABLE = { created: 'created_at', status: 'status', weight: 'weight_kg' } as const;
const column = SORTABLE[req.query.sort as keyof typeof SORTABLE] ?? 'created_at';
const rows = await sql`SELECT id, status FROM shipments
                       WHERE organization_id = ${session.organizationId}
                       ORDER BY ${sql(column)} LIMIT ${limit}`;
```

## Cross-site scripting

| Context | Rule |
| --- | --- |
| HTML body | Rely on the framework's automatic escaping; never build HTML strings from input |
| Raw HTML sinks (`dangerouslySetInnerHTML`, `v-html`, `innerHTML`, `{@html}`) | Only with output from a maintained sanitizer configured for the allowed tags, applied at render |
| Attributes | Quote them; treat `href` and `src` as URLs: allow only `http`, `https`, `mailto`, and relative paths, never `javascript:` |
| Script context | Do not interpolate into inline scripts; pass data through a JSON script block or data attributes, serialized safely |
| Markdown and rich text | Render, then sanitize the resulting HTML |
| Uploaded SVG and HTML | Serve as download or from a separate origin; never inline untrusted SVG |

A Content Security Policy with nonces or hashes limits the damage of a missed case and is worth deploying in report-only mode first. It does not replace correct output handling.

## Cross-site request forgery

Applies whenever the browser attaches credentials automatically (cookies, HTTP auth).

- State-changing requests are never `GET`.
- Session cookies: `HttpOnly`, `Secure`, and `SameSite=Lax` or stricter. `Lax` alone does not cover every case (same-site subdomains, top-level `POST` in some flows).
- Add a second defense for mutations: the framework's built-in CSRF token or origin verification (compare `Origin` or `Sec-Fetch-Site` against the allowed origin).
- Check how the framework protects its own mutation mechanism (for example server actions or form actions) in the installed version, and whether custom route handlers are covered. They often are not.
- CORS is not CSRF protection. A permissive CORS policy with credentials is its own vulnerability.

## Open redirects and URL handling

- Redirect targets taken from input (`next`, `returnTo`, `redirect_uri`) must be a relative path beginning with a single `/` (not `//` or `/\`), or match an exact allowlist of origins.
- Parse with the URL parser and compare origins; do not use substring or prefix checks.
- OAuth `redirect_uri` is matched exactly against registered values, and `state` is verified.

## Authentication and session flows

| Flow | Verify |
| --- | --- |
| Sign-in | Rate limiting per account and per source; identical responses for unknown user and wrong password; session identifier rotated on success |
| Password reset | Token is single-use, high-entropy, short-lived, stored hashed, bound to the account; reset revokes other sessions; response does not reveal whether the email exists |
| Email or phone change | Re-authentication; confirmation to the new address and notice to the old one |
| MFA | Enforced on the server for every session-creating path, including reset and OAuth; recovery codes single-use |
| OAuth and SSO | `state` and PKCE verified; email from the provider trusted only if verified; account linking requires proof of both accounts |
| JWT | Algorithm fixed on the verifier, `none` rejected; signature, expiry, issuer, and audience checked; secrets not shared across environments; a revocation strategy for long-lived tokens |
| API keys | Shown once, stored hashed, scoped, revocable, and identifiable by prefix |
| Sign-out | Session invalidated on the server, not only the cookie cleared |

## File uploads

1. Enforce size limits before reading the body into memory.
2. Decide type from content inspection and an allowlist, not from the client's filename or `Content-Type`.
3. Generate the stored name; never use the client's filename in a path.
4. Store outside the web root or in object storage; serve with a fixed, safe `Content-Type`, `Content-Disposition: attachment` where inline rendering is not needed, and `X-Content-Type-Options: nosniff`.
5. Never store uploads where the server will execute them.
6. Process images and documents with maintained libraries, in a constrained environment, with time and memory limits.
7. Authorize downloads per object; do not rely on unguessable URLs for sensitive files unless they are short-lived signed URLs.

## Mass assignment and over-exposure

- Never pass a request body directly to a create or update call. Pick allowed fields explicitly so a client cannot set `role`, `ownerId`, `isAdmin`, or `price`.
- Select explicit fields in responses. Returning whole records leaks password hashes, tokens, and internal flags, especially through nested relations and GraphQL.
- For GraphQL: authorize in resolvers per field and object, limit query depth and cost, and disable introspection in production only as a minor hardening, never as the control.

## WordPress and WooCommerce

| Concern | Rule |
| --- | --- |
| Capability | `current_user_can()` with the specific capability on every admin action, AJAX handler, and REST route; `is_admin()` is not a permission check |
| Nonces | `check_admin_referer()` or `check_ajax_referer()` on state-changing requests; a nonce is CSRF protection, not authorization |
| REST routes | A real `permission_callback`; never `__return_true` for anything that reads private data or writes |
| Input | Sanitize on input with the specific function (`sanitize_text_field`, `absint`, `sanitize_email`, `wp_kses_post`); `wp_unslash` first |
| Output | Escape late with the context function: `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`, `wp_json_encode` for scripts |
| Database | `$wpdb->prepare()` for every query with variables; `esc_sql` is not a substitute; table and column names from an allowlist |
| Files | Use the upload API (`wp_handle_upload`) with a MIME allowlist; never include files from request parameters |
| AJAX | `wp_ajax_nopriv_` handlers are public: treat every parameter as hostile |
| Options and meta | Do not expose secrets through public options, REST meta, or localized script data |
| WooCommerce | Recalculate prices and totals on the server; verify order ownership with the order key or user; verify payment webhooks with the gateway's signature |

## Security headers

| Header | Purpose | Note |
| --- | --- | --- |
| `Content-Security-Policy` | Limits script and resource sources | Nonce or hash based; roll out in report-only first |
| `Strict-Transport-Security` | Forces HTTPS | Only when all subdomains support it if `includeSubDomains` is set |
| `X-Content-Type-Options: nosniff` | Stops MIME sniffing | Always |
| `Referrer-Policy` | Limits referrer leakage | `strict-origin-when-cross-origin` is a sound default |
| `frame-ancestors` in CSP | Prevents clickjacking | Replaces `X-Frame-Options` |
| `Permissions-Policy` | Disables unused browser features | Optional hardening |

Headers reduce impact; they do not fix a vulnerable handler.

## Verification matrix

```text
Injection:   payload with quote, comment, and operator characters is stored or
             returned as literal text; query plan unchanged.
XSS:         <img src=x onerror=...> and javascript: URLs render inert in every
             context where the value appears, including admin views and emails.
CSRF:        cross-origin form POST with the victim's cookies is rejected.
Redirect:    //evil.example, /\evil.example, and https://evil.example are refused.
Auth:        reset token reuse fails; old sessions end after reset; unknown and
             known emails produce the same response.
Upload:      .php, .svg, and polyglot files are rejected or served as inert downloads.
Assignment:  extra fields (role, ownerId) in the body are ignored.
```

Run these against a local or otherwise authorized instance with synthetic accounts and data.
