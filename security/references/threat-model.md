# Threat modeling

Read when designing or reviewing a sensitive feature, preparing a broad audit, changing business logic, or adding a tool or agent boundary. Scale the model to the decision: one endpoint may need a five-row table, a platform needs a diagram and linked decisions. For LLM agents also read [ai-agents.md](ai-agents.md).

## The four questions

1. What are we protecting, and how does it work?
2. What can go wrong?
3. What will we do about it?
4. How will we know the controls work?

## Describe the system just enough

- **Actors**, each with concrete starting access: anonymous visitor, registered user, user of another tenant, content author, support staff, administrator, compromised integration, compromised dependency or build step. Model insiders only when relevant; encryption at rest does not stop a database user who can issue authorized reads or fetch the same keys.
- **Assets:** data (personal, payment, credentials, content), capabilities (send email, move money, deploy code), availability.
- **Flows and trust boundaries:** every place identity, privilege, tenant, or parsing context changes. A list of flows is enough; draw a diagram only when the list becomes hard to follow.

| Boundary | Questions |
| --- | --- |
| Browser or API client to service | Which identity is verified, and which action on which resource is permitted? |
| Service to storage or cache | Do tenant and field permissions survive in queries, keys, and outputs? |
| Webhook or job to a privileged operation | Who authenticated the event, and what if it repeats or arrives out of order? |
| Upload or URL to parser or network | Which bytes and destinations are reachable, and what limits apply? |
| CI to production artifact | Can untrusted contributors influence code that receives release credentials? |
| Retrieved content to agent or tool | Can document text trigger a capability beyond the user's authorized task? |

Separate authentication, authorization, validation, isolation, and integrity controls; do not assume every boundary needs the same mechanism.

## Find threats with prompts, not ritual

Walk each boundary and asset with these questions (STRIDE as a checklist):

| Prompt | Ask |
| --- | --- |
| Spoofing | Can an actor pretend to be another user, service, or provider? |
| Tampering | Can data, code, or configuration be changed by someone who should not change it, in transit or at rest? |
| Repudiation | Could an actor deny an action, and is there an audit trail that would show it? |
| Information disclosure | Where can data leak: responses, logs, caches, errors, exports, side channels? |
| Denial of service | Can a cheap request trigger expensive work, or can one tenant starve the rest? |
| Elevation of privilege | Can a lower-privileged actor perform a higher-privileged action or reach another tenant? |

Then ask two questions STRIDE misses: how could a *legitimate* feature be abused at scale (invites, referrals, exports, trials), and what happens when a step fails halfway or a call times out.

## Write each threat as an invariant

Name what must stay true before choosing a mechanism: "A user reads only their own invoices." "A coupon redeems at most its usage limit." "Stock never drops below its allowed bound." "A refund never exceeds the captured amount." "An invitation applies only to its intended scope." Positive cases count too: preventing every refund would stop refund abuse and break the product.

## Choose controls and verification

For each credible threat record: the existing control, the gap, the proposed control **and where it will live** (file, layer, owner), and an observable check. Prefer controls that prevent (authorization, scoping, parameterization, isolation), then detect (logging, alerts), then respond (revocation, containment) and recover (backups). Rank by reachability, impact, and ease, and write down accepted residual risk with an owner. A fixed list of vulnerability classes is a reminder, not evidence about this system.

## Output template

| # | Boundary or asset | Actor and goal | Invariant | Existing control | Gap | Proposed control (where) | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- |

Worked example, "export invoices as CSV":

| # | Boundary or asset | Actor and goal | Invariant | Existing control | Gap | Proposed control (where) | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Export endpoint | Signed-in user wants another tenant's invoices via `?tenantId=` | An export contains only the caller's tenant | Login required | Tenant id read from the query | Derive tenant from the session in the data layer (`data/invoices.ts`) | Test with two tenants requesting each other's id |
| 2 | Background export job | Same user, via the job payload | The job runs with the requester's scope | Job runs as service account | Payload carries a client-supplied `tenantId` | Store `userId` at enqueue, rebuild scope in the worker, re-check authorization at run time | Enqueue with a forged payload; expect a denial |
| 3 | Download link | Anyone with the URL | Only the requester downloads the file | Random file name | Link is public and permanent | Signed URL bound to the user, expiring in minutes | Open the link signed out and after expiry |
| 4 | CSV content | Attacker plants `=HYPERLINK(...)` in a customer name | Exported cells are never interpreted as formulas | None | Raw values written | Prefix cells starting with `=`, `+`, `-`, `@`, tab, or CR with a single quote | Export a row with each prefix and open it in a spreadsheet |
| 5 | Export size | Anonymous or low-privilege user, cheap request | One request cannot exhaust memory or the database | None | Unbounded query loaded into memory | Row cap, keyset streaming, per-user rate limit | Request a huge range; expect a bounded response |

## Requirements to extract at feature kickoff

Authentication strength and session rules, the authorization model, data classification and retention, what must be logged, rate limits, secrets handling, third-party exposure, behavior on failure, and any compliance obligations the user actually provided. Never promise compliance from a technical checklist.

## Principles for choosing controls

- **Least privilege:** give each identity, token, and job only what its task needs.
- **Deny by default and mediate every access:** check on each path to the resource, not once at the front.
- **Defense in depth:** add layers, but never as a substitute for the primary control.
- **Fail safely:** an error path must not grant access or skip validation.
- **Keep mechanisms small:** fewer special cases mean fewer holes.
- **Separate duties** for the most dangerous actions (approve versus execute).
- **Never trust the client:** it supplies requests, not facts.
- **Keep it usable:** controls that users bypass protect nothing.
