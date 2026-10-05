# Injection, request forgery, and unsafe interpreters

Read when untrusted values reach a query, command, renderer, parser, file operation, redirect, or outbound request. Trace parsing and normalization as well as the final call. The snippets here were executed against hostile inputs; adapt them to the project's language and framework rather than pasting blindly.

## Choose the safe representation

Validate shape, type, bounds, and business meaning at the receiving boundary. Keep data separate from syntax with parameters, typed APIs, and safe DOM operations. Encode at the output context. No single sanitizer makes one stored string safe for SQL, HTML, JavaScript, and URLs at once.

## SQL and query languages

Bind values through the driver. SQL identifiers (sort columns, table names) cannot be bound, so map the caller's choice to a fixed fragment. Use an own-property check: a plain `SORTS[sort] ?? default` lets `constructor`, `toString`, and `__proto__` through as "valid" keys.

```ts
// Values travel as parameters; the SQL text stays constant.
const { rows } = await pool.query(
  'SELECT id, title FROM posts WHERE tenant_id = $1 AND author_id = $2 LIMIT $3',
  [tenantId, authorId, 50],
);

// Identifiers: map the choice to a fixed fragment, checking own properties.
const SORTS = { newest: 'created_at DESC', title: 'title ASC' } as const;
const orderBy = Object.hasOwn(SORTS, sort) ? SORTS[sort as keyof typeof SORTS] : SORTS.newest;
const listQuery = `SELECT id, title FROM posts WHERE tenant_id = $1 ORDER BY ${orderBy} LIMIT $2`;
```

Audit ORM escape hatches (`$queryRawUnsafe`, `sql.raw`, `whereRaw`, string-built `raw()`), dynamic SQL inside stored procedures, and `LIKE` patterns built from input (escape `%` and `_`). A raw API with proper binding is not a vulnerability: prove that attacker input controls query structure or the data scope.

Document databases fail differently. A body like `{"password": {"$ne": null}}` turns a value into an operator, so require strings where strings are expected (a schema does this), disable server-side JavaScript (`$where`), and never pass request objects straight into a filter.

## Browser output (XSS)

| Destination | Control |
| --- | --- |
| Text node | Framework text rendering or `textContent` |
| HTML attribute | Safe attribute APIs, or correct quoted encoding; never build event-handler attributes |
| URL (`href`, `src`, redirects) | Parse and allow-list the scheme and destination (below), then encode for the context |
| Rich HTML | A maintained sanitizer with an allowlist, such as DOMPurify; never a hand-written regex |
| Script or inline state | HTML-safe serialization (below), or a separate JSON response |

```ts
export function jsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
```

`JSON.stringify` alone keeps a literal closing script tag, and a `type="application/json"` script still goes through HTML parsing, so changing the type is not a fix. Use `jsonForScript` inside the element (or fetch JSON separately). Since ES2019, U+2028 and U+2029 are legal in string literals, so escaping `<`, `>`, and `&` is enough for modern browsers.

```ts
const ALLOWED_SCHEMES = new Set(['https:', 'http:', 'mailto:']);

export function safeHref(input: string): string | null {
  try {
    const url = new URL(input, 'https://placeholder.invalid'); // relative URLs resolve against a dummy base
    return ALLOWED_SCHEMES.has(url.protocol) ? input : null;
  } catch {
    return null;
  }
}
```

`safeHref` rejects `javascript:`, `data:`, `vbscript:` and their case, whitespace, and control-character disguises, because it checks the parsed scheme. Use it for any user-supplied link.

Also trace DOM sources into sinks (`location`, `document.referrer`, `window.name`, `postMessage`). A message handler must check `event.origin` against an exact value and validate the payload shape; when sending sensitive data set an explicit target origin. Check sanitizer configuration and any mutation after sanitizing. A strict CSP (nonces with `'strict-dynamic'`, `object-src 'none'`, `base-uri 'none'`) and Trusted Types reduce impact but do not replace fixing the sink. An HttpOnly cookie does not stop XSS from issuing authenticated requests. Severity depends on who sees the content and what they can do: admin-visible text is neither automatically executable nor automatically critical.

## Commands, templates, deserialization

**Commands.** Prefer a library to a subprocess. When you must spawn, use the argument-array API with no shell, validate operands, stop option injection (a leading `-` from user input, the `--` end-of-options marker where the tool supports it), and bound time, output, and environment:

```ts
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

export async function gitLogForFile(repoDir: string, relativePath: string): Promise<string> {
  if (!/^[\w./-]+$/.test(relativePath) || relativePath.startsWith('-') || relativePath.includes('..')) {
    throw new Error('invalid path');
  }
  const { stdout } = await run('git', ['-C', repoDir, 'log', '--max-count=20', '--oneline', '--', relativePath], {
    timeout: 5_000,
    maxBuffer: 1_000_000,
    env: { PATH: process.env.PATH ?? '' }, // minimal environment; no shell is involved
  });
  return stdout;
}
```

An argument array alone does not make dangerous flags safe, and on Windows `.cmd` and `.bat` launches pass through `cmd.exe`, which reintroduces parsing.

**Templates.** Never treat untrusted text as template source; pass it as data.

```python
# Vulnerable: user text becomes a Jinja template
return render_template_string(request.args["greeting"])
# Safe: user text is a value
return render_template("hello.html", greeting=request.args["greeting"])
```

| Hazard | Rule |
| --- | --- |
| Deserialization | Never `pickle.loads`, Java native serialization, `unserialize()`, `Marshal.load`, or `BinaryFormatter` on untrusted bytes. Use JSON with a schema; `yaml.safe_load`; PHP `unserialize($data, ['allowed_classes' => false])` only as a stopgap |
| Prototype pollution | Do not deep-merge untrusted JSON into objects. Validate with a strict schema, use `Map` or `Object.create(null)`, reject `__proto__`, `constructor`, and `prototype` keys |
| XML | Disable DTDs and external entities (`defusedxml` in Python; secure-processing and disallow-doctype in Java; `DtdProcessing.Prohibit` in .NET) and cap expansion |
| Regular expressions | Avoid nested quantifiers on input you do not control, cap input length, and prefer a linear-time engine (RE2) for user-supplied patterns |
| `eval`, `new Function`, `vm` | Never on request data. Parse a data format instead |
| GraphQL | Authorize per field, limit depth, cost, aliases, and batching, and decide the introspection policy |

## Files and paths

Canonicalize against an allowed base and compare path components, never a string prefix (`/data/uploads-evil` starts with `/data/uploads`). Resolve symlinks, reject absolute and traversal input, and prefer storage ids you generate over user-supplied names.

```ts
import { realpath } from 'node:fs/promises';
import path from 'node:path';

export async function resolveInside(baseDir: string, userPath: string): Promise<string> {
  const base = await realpath(baseDir);
  const real = await realpath(path.resolve(base, userPath)); // normalizes ../ and absolute input, follows symlinks
  const relative = path.relative(base, real);
  if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error('path escapes the allowed directory');
  }
  return real;
}
```

A check followed by an open can still race with a symlink swap, so keep upload directories writable only by the application. Archive extraction needs the same containment test on every entry name, plus rejection of symlink and hardlink entries and caps on entry count, expanded size, and depth.

## SSRF

For features that fetch a user-supplied URL (previews, importers, image proxies, webhooks the user configures, PDF and screenshot renderers), prefer a destination allowlist. For arbitrary public destinations: parse once with the WHATWG `URL` (it normalizes `2130706433`, `0x7f000001`, and `[::1]`), allow only `http` and `https`, reject credentials and unexpected ports, check IP literals directly, resolve names yourself and require **every** answer to be a public address, connect to the address you validated, handle each redirect as a new request, cap time and bytes, and never forward ambient credentials. IP literals skip DNS, so a lookup hook alone does not stop `http://169.254.169.254/`.

```ts
import { lookup as dnsLookup } from 'node:dns';
import { BlockList, isIP } from 'node:net';
import { Agent, fetch } from 'undici';

const deniedV4 = new BlockList();
for (const [network, prefix] of [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16],
  ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15],
  ['198.51.100.0', 24], ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4],
] as const) {
  deniedV4.addSubnet(network, prefix, 'ipv4');
}

const allowedV6 = new BlockList(); // used as a set: only global unicast, 2000::/3
allowedV6.addSubnet('2000::', 3, 'ipv6');
const deniedV6 = new BlockList(); // special ranges inside 2000::/3
for (const [network, prefix] of [['2001::', 32], ['2001:db8::', 32], ['2002::', 16]] as const) {
  deniedV6.addSubnet(network, prefix, 'ipv6');
}

export function isPublicAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return !deniedV4.check(address, 'ipv4');
  if (family === 6) return allowedV6.check(address, 'ipv6') && !deniedV6.check(address, 'ipv6');
  return false;
}

type Address = { address: string; family: number };
type LookupCallback = (error: Error | null, address?: string | Address[], family?: number) => void;

// Resolve, then refuse unless EVERY returned address is public. Connecting to the address
// this hook returns closes the gap a separate "validate, then fetch" step leaves for DNS rebinding.
export function makeSafeLookup(resolve: typeof dnsLookup = dnsLookup) {
  return (hostname: string, options: { all?: boolean }, callback: LookupCallback) => {
    resolve(hostname, { all: true }, (error, addresses) => {
      if (error) return callback(error);
      const list = addresses as Address[];
      if (list.length === 0 || !list.every((entry) => isPublicAddress(entry.address))) {
        return callback(new Error(`blocked destination: ${hostname}`));
      }
      return options.all ? callback(null, list) : callback(null, list[0].address, list[0].family);
    });
  };
}

// Node skips DNS (and therefore the lookup hook) for IP literals, so check them here.
export function assertFetchableUrl(raw: string): URL {
  const url = new URL(raw); // normalizes 2130706433, 0x7f.1, and [::1] to canonical hosts
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('scheme not allowed');
  if (url.username || url.password) throw new Error('credentials in URL not allowed');
  if (url.port) throw new Error('explicit ports not allowed');
  const host = url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname;
  if (isIP(host) && !isPublicAddress(host)) throw new Error('address not allowed');
  return url;
}

const dispatcher = new Agent({ connect: { lookup: makeSafeLookup() } });

export async function safeFetch(raw: string, { maxRedirects = 3, maxBytes = 1_000_000, timeoutMs = 5_000 } = {}) {
  let url = assertFetchableUrl(raw);
  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    const response = await fetch(url, { dispatcher, redirect: 'manual', signal: AbortSignal.timeout(timeoutMs) });
    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel();
      url = assertFetchableUrl(new URL(location, url).toString()); // validate every hop
      continue;
    }
    const chunks: Uint8Array[] = [];
    let total = 0;
    for await (const chunk of response.body ?? []) {
      total += chunk.length;
      if (total > maxBytes) throw new Error('response too large');
      chunks.push(chunk);
    }
    return { status: response.status, body: Buffer.concat(chunks) };
  }
  throw new Error('too many redirects');
}
```

Keep a network egress policy as another layer (cloud metadata services should require their token mode, and the workload should not be able to reach internal ranges). Do not forward cookies or internal headers to the destination. To prove an SSRF during an authorized test, point the feature at a listener you control; you never need to contact a real metadata endpoint.

## CSRF and cross-origin behavior

State-changing requests authenticated by ambient credentials (cookies, HTTP auth, client certificates) need a defense. Use the framework's supported CSRF protection, and add provenance checks: browsers send `Sec-Fetch-Site` and `Origin`, so reject unsafe-method requests that are not same-origin.

```ts
export function isTrustedBrowserRequest(headers: Headers, allowedOrigins: ReadonlySet<string>): boolean {
  const site = headers.get('sec-fetch-site');
  if (site) return site === 'same-origin' || site === 'none'; // modern browsers always send it
  const origin = headers.get('origin');
  if (origin) return allowedOrigins.has(origin);
  return false; // no browser provenance headers: do not accept cookie-authenticated state changes
}
```

Apply it to cookie-authenticated unsafe methods (`POST`, `PUT`, `PATCH`, `DELETE`); a request without those headers is not a browser form or fetch. A bearer token placed in a header by your own client has a different model: there are no ambient credentials to forge. Keep `GET` free of state changes. A JSON content type or CORS configuration is not a CSRF defense (a cross-site form can send a JSON-looking body as `text/plain`). Include login and account-linking flows, and set `frame-ancestors` (or `X-Frame-Options`) against clickjacking.

## Redirects, headers, and exports

```ts
export function safeRedirectPath(next: string | null | undefined, fallback = '/'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return fallback;
  try {
    const url = new URL(next, 'https://app.invalid');
    if (url.origin !== 'https://app.invalid') return fallback; // catches tab, newline, and backslash tricks
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
```

Use it for post-login `next` and similar parameters, so an attacker cannot turn your login page into an open redirect (a phishing and OAuth-chain enabler). CSV and spreadsheet exports need formula neutralization:

```ts
export function csvSafe(value: string): string {
  const text = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value; // neutralize formula prefixes
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
```

Strip CR and LF from values placed in response headers, log lines, and email headers, or use APIs that reject them. Prefer a mail provider's structured API over hand-built headers.

## Primary references

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Query Parameterization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)
