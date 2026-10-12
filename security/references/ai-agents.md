# Agent capabilities and SSRF

Read when: Reviewing retrieved-content injection, privileged agent tools, or URL-fetching boundaries.

## Agent threat decisions

| Exposure | Enforce outside the model |
| --- | --- |
| Untrusted tickets/pages/files can instruct the agent | Data provenance and instruction separation; malicious text never gains authority |
| Tool can read arbitrary customer data | Acting-user identity, object/tenant scope, minimal fields |
| Tool can send/export/publish | Exact destination/content authorization and data-flow limits |
| Shell or SQL built from model text | Structured arguments, parameterized operations, allowlisted capability |
| Local files | Resolved-path containment; symlink/junction handling; least privilege |
| Network access | Controlled egress, destination policy, request limits |
| Tool output contains secrets/links | Redaction and safe presentation; restrict sensitive exfiltration |

Untrusted input, broad sensitive reads, and an external send capability together create an exfiltration path. Remove or isolate an unnecessary leg; enforce the legitimate workflow in tool code. A prompt reminder alone is insufficient.

Honor existing specific user authorization. When authorization is missing for a consequential send, prepare exact recipients/content first. Do not force confirmation for ordinary authorized reads.

## SSRF connection policy

| Boundary | Required consideration |
| --- | --- |
| URL parse | Standard parser; permitted http/https schemes; reject credentials; allowed ports |
| Host/address | Normalize literals and validate IPv4, IPv6, mapped forms, and reserved/nonpublic ranges with a maintained address library |
| DNS | Resolve and validate every candidate A/AAAA address, not just one |
| Connection | Pin the validated destination or use a controlled egress proxy; a new uncontrolled DNS lookup reopens the gap |
| TLS | Preserve the original host/SNI and certificate verification while pinning the connection |
| Redirect | Disable or manually bound and revalidate every hop |
| Response | Timeout, byte/decompression limits, content policy, no leaked service credentials |
| Deployment | Network egress restrictions; block metadata/internal services in depth |

Do not copy a short private-IP regex or a "DNS check, then fetch(original URL)" helper as complete protection. IP literals may bypass DNS hooks; DNS rebinding, redirects, IPv6 variants, and alternate addresses need the same policy. Follow [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## Synthetic verification matrix

```text
Allowed public fixture: request succeeds under policy.
Private/loopback IPv4 and IPv6 fixtures: rejected.
IPv4-mapped IPv6 and unusual literal forms: normalized and rejected as applicable.
DNS has mixed public/private answers: policy rejects unsafe candidates.
Redirect to disallowed fixture: rejected.
DNS answer changes after validation: connection stays pinned or egress blocks it.
Oversized/slow response: bounded failure.
```

Use local/synthetic listeners and resolver fixtures. Do not probe real metadata endpoints or internal networks without authorization.
