# Injection, request forgery, and unsafe interpreters

Read when untrusted values reach a query, command, renderer, parser, file operation or network request. Trace parsing and normalization as well as the final API call.

## Choose the safe representation

Validate shape, type, bounds and business meaning at the receiving boundary. Keep data separate from executable syntax using parameters, typed APIs and safe DOM operations. Encode at the output context when required. A generic sanitizer cannot make one stored string safe for SQL, HTML, JavaScript and URLs simultaneously.

## SQL and query languages

Bind values through the actual driver's safe interface. Identify raw fragments and dynamic identifiers; ordinary value parameters do not substitute SQL identifiers, although some APIs provide separate identifier quoting/placeholders. Map caller choices to allowed columns and sort directions even when identifier quoting is available.

Audit ORM escape hatches and dynamic SQL inside stored procedures. For document queries, reject unwanted operators and types rather than passing arbitrary objects through. A raw API with proper binding is not a vulnerability; prove attacker influence over query structure or an unauthorized data scope.

## Browser output

| Destination | Control |
| --- | --- |
| Text node | Framework text rendering or textContent |
| HTML attribute | Safe attribute APIs or correct quoted-attribute encoding; reject event-handler attributes |
| URL | Parse and allow permitted schemes/destinations, then encode for the surrounding context |
| Rich HTML | Maintained context-appropriate sanitizer and safe rendering; preserve required content deliberately |
| Script/inline state | Framework's safe serialization mechanism; JSON.stringify alone is not HTML-safe |

A type=application/json script element still participates in HTML parsing: a literal closing script tag can terminate it. Use HTML-safe serialization that escapes the relevant characters, or fetch JSON as a separate response. Do not present changing the script type as a complete XSS fix.

Trace DOM sources such as URL components and postMessage into sinks. Validate message origin, expected source window and payload shape; set an explicit target origin when sending sensitive data. Check sanitizer configuration and later mutations that can invalidate sanitization.

CSP can reduce impact but does not replace correcting the unsafe sink. Severity depends on the affected principal, privileges, interaction and reachable actions; admin-visible text is not automatically executable or automatically the highest severity.

## Commands, templates, and files

Prefer a maintained library to invoking a shell. When a subprocess is necessary, use its argument-array API without shell interpretation. Prevent option injection with validated operands and supported end-of-options markers; an argument array alone does not make dangerous flags safe. Set bounded runtime/output, a deliberate working directory and minimum environment.

Do not treat untrusted content as a template program or deserialize it into arbitrary executable object types. Inspect the exact parser mode and library contract. Avoid hand-built escaping where a typed safe API exists.

For files, canonicalize against an allowed base and verify path-component containment, not a string prefix. Account for absolute paths, alternate separators, symlinks/junctions and check/use races on the target platform. Use storage identifiers or directory-relative safe operations when possible. Archive extraction needs the same protections plus bounded expansion.

## SSRF

Prefer allowed destinations when the feature permits them. Parse URLs consistently and restrict schemes/ports. For arbitrary public destinations, validate IPv4/IPv6 and all resolved addresses against disallowed local, reserved and metadata ranges; disable redirects or validate each hop. Tie validation to the actual connection to resist DNS rebinding while preserving TLS hostname verification. Use a supported egress proxy or hardened fetch layer instead of a brittle regex filter.

Bound redirects, time and response bytes. Do not forward ambient credentials or internal headers to untrusted destinations. Normalize returned content and retain network egress controls as another layer. Proving SSRF does not require contacting a real cloud metadata endpoint; use an isolated controlled destination within scope.

## CSRF and cross-origin behavior

For state changes authenticated by ambient credentials, use the framework's supported CSRF protection and evaluate SameSite, Origin/Referer or Fetch Metadata controls as appropriate. A bearer token explicitly placed in a header has a different CSRF model from a cookie, even if both authenticate users.

Keep safe methods free of intended state-changing actions. JSON or CORS alone is not a universal CSRF defense. Follow the framework's complete supported design instead of adding a second token mechanism indiscriminately. Include login/account-linking flows and client-side request construction where relevant.

## Other boundaries

| Boundary | Inspect |
| --- | --- |
| Spreadsheet export | Formula interpretation in the intended spreadsheet application; select a safe cell/text strategy |
| Logs and email headers | Structured APIs, newline/control handling and sensitive content |
| Redirect | Allowed destinations and OAuth/login chains |
| Regex/parser | Worst-case runtime, depth, input size and enabled expansion features |
| XML | External entities/network retrieval and expansion limits |
| GraphQL | Field authorization plus request cost, depth and alias amplification |

## Primary references

- [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html): context-specific encoding and dangerous contexts.
- [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html): destination validation and network controls.
