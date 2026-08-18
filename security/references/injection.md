# Injection and untrusted input

Read when reviewing anything that takes user input and passes it to an interpreter, a renderer, a query, a shell, or another service.

## The one rule

**Never build executable syntax by concatenating untrusted strings.** Use a mechanism that separates code from data: parameter binding, an argument array, a structured API, or a template engine that escapes by default. Escaping is the fallback when separation is impossible — not the first choice.

## Validate on input, escape on output

These are different jobs and both are required.

- **Validation** happens once, at the boundary, against an allowlist: type, shape, length, range, format, and business rules. Reject what does not conform rather than trying to repair it.
- **Escaping** happens at each output, against the rules of that specific destination. The same string is escaped differently for HTML text, an HTML attribute, a URL, JavaScript, CSS, SQL, a shell, a CSV cell, and a log line.

Escaping on input corrupts the stored data and still fails, because you cannot know at input time where the value will be rendered.

## SQL

- Parameterize every query. Placeholders bind values; they cannot bind identifiers.
- Dynamic table names, column names, sort fields, and sort directions must be validated against a fixed allowlist:

```js
const SORTABLE = { created: 'created_at', name: 'display_name' };
const column = SORTABLE[input.sort] ?? 'created_at';
const dir = input.dir === 'asc' ? 'ASC' : 'DESC';
```

- ORMs are safe until you reach for the raw escape hatch. Audit every `raw`, `literal`, `whereRaw`, and string-built fragment.
- Stored procedures are not automatically safe: dynamic SQL inside a procedure has the same flaw.
- Blind and time-based injection is still injection. The absence of a visible error proves nothing.

## Cross-site scripting

Three contexts, three fixes:

| Context | Attack shape | Fix |
| --- | --- | --- |
| HTML text | `<script>` or an event-handler-bearing tag | Escape entities, or let the framework render text nodes |
| HTML attribute | breaking out of quotes, `onerror=` | Escape and always quote attributes; never interpolate into an event attribute |
| URL attribute (`href`, `src`) | `javascript:` and `data:` schemes | Allowlist the scheme before rendering |

Additional rules:

- Modern frameworks escape by default. Every bypass is an explicit opt-out: `dangerouslySetInnerHTML`, `v-html`, `innerHTML`, `insertAdjacentHTML`, `document.write`, `outerHTML`, jQuery `.html()`. Audit every occurrence.
- Rich text from users must pass through a maintained allowlist sanitizer on the server. A regular expression that strips `<script>` is not a sanitizer.
- Never place untrusted data inside a `<script>` block. Pass it as JSON in a `type="application/json"` element and parse it, or attach it via a data attribute.
- Content Security Policy is defense in depth. A strict, nonce-based policy meaningfully reduces impact, but it does not fix the injection and must not be presented as the remediation.
- **DOM XSS** has no server component: `location.hash`, `location.search`, `postMessage` data, and `referrer` flowing into a sink are just as exploitable. Audit client code too.
- Stored XSS in an admin-visible field (a support ticket, a username, an uploaded file name) is high severity: it executes in the highest-privilege session in the system.

## Command execution

- Prefer a native library over shelling out.
- When a subprocess is required, pass an argument array with no shell interpretation. Never build a command string.
- Validate any user-influenced argument against an allowlist. A path, a filename, or a format flag are all injection vectors (`--output`, `-o`, and friends can write anywhere).
- Set a timeout, a working directory, a bounded environment, and a maximum output size.

## Server-side request forgery

Anything that fetches a URL the user supplied — webhooks, previews, image import, PDF rendering, "verify my site", integrations.

Controls, in order of strength:

1. Allowlist the exact destinations if the feature permits it.
2. Otherwise: allow only `http` and `https`; resolve the hostname and reject loopback, private, link-local, multicast, and cloud metadata ranges; re-check after **every** redirect, because the first response can redirect to an internal address.
3. Cap redirects, response size, and total time.
4. Send no ambient credentials and no internal headers on the outbound request.
5. Return a normalized result, not the raw upstream response, so the endpoint cannot be used as a proxy or a port scanner.

DNS rebinding defeats a check performed before the connection: resolve and connect to the same validated address, or use a fetch layer that supports pinning.

## Cross-site request forgery

- Required whenever a state-changing request is authenticated by ambient credentials (a cookie).
- Use the framework's token mechanism, plus `SameSite` cookies as a second layer. `SameSite` alone is not sufficient for every browser and every flow.
- `GET` must never change state. A `GET` that deletes something is exploitable by an image tag.
- JSON endpoints are not automatically safe: verify the token, or verify the origin, rather than relying on the content type.
- Login itself needs CSRF protection to prevent login-fixation attacks that log a victim into the attacker's account.

## Template, expression, and path injection

- Never compile a template from user input. Server-side template injection usually means immediate remote code execution.
- Never pass user input to `eval`, `Function`, `setTimeout` with a string, `exec`, `pickle`/`unserialize`, or a YAML loader that instantiates arbitrary objects.
- File paths: resolve, then verify the resolved path is inside the intended base directory. Do not filter for `..` — normalization and alternate encodings will get around it.

## Other injection sinks worth checking

| Sink | Risk |
| --- | --- |
| Email headers | Header injection via a newline in a name or subject |
| CSV export | Formula injection: a cell starting with `=`, `+`, `-`, or `@` executes in a spreadsheet |
| Logs | Forged log entries and terminal escape sequences via newlines and control characters |
| Redirect targets | Open redirect used for phishing and OAuth token theft |
| `postMessage` receivers | Missing origin check accepts messages from any frame |
| Regular expressions | Catastrophic backtracking on attacker-controlled input, causing denial of service |
| XML parsers | External entity expansion reading local files; disable entity resolution |
| Archive extraction | Path traversal in entry names, and decompression bombs |
| GraphQL | Unbounded query depth and aliasing used for amplification |
