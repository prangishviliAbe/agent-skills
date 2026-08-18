# Threat modeling

Read when scoping an audit, designing a sensitive feature, or deciding what deserves attention.

## The four questions

1. **What are we building?** A diagram in words: components, data stores, trust boundaries, and who talks to whom.
2. **What can go wrong?** Per boundary, per asset.
3. **What are we going to do about it?** A control, an accepted risk, or a design change.
4. **Did we do a good job?** A verification for each control.

Keep it to one page. A threat model nobody reads protects nothing.

## Map trust boundaries

A trust boundary is any place where data or control crosses from one level of trust to another. Every one of them needs validation and authorization on the receiving side.

Common boundaries, all of which are crossed by attacker-controlled data at some point:

- Browser to server (every request, including ones your UI would never send)
- Server to database, cache, queue, or file system
- Your service to a third-party API, and their webhook back to you
- One tenant's data to another's, inside the same table
- Unauthenticated to authenticated, and user to admin
- Build pipeline to production runtime
- User-generated content to another user's browser
- Untrusted document, page, or tool output to an AI agent's context

## Attacker profiles

Model concrete actors rather than a generic hacker. For each, ask what they can already do and what they want next.

| Actor | Already has | Wants |
| --- | --- | --- |
| Anonymous internet | Public routes, registration, password reset, public content | Any authenticated access, data, or resource abuse |
| Registered user | A valid session, their own data, their own IDs | Other users' data, admin functions, free goods |
| Other tenant | A valid account in the same system | Cross-tenant reads and writes |
| Malicious content author | The ability to store text, HTML, files, or a name | Stored XSS, phishing, admin session theft |
| Low-privilege staff | An internal login | Privilege escalation, bulk export, audit-log gaps |
| Compromised dependency | Code execution inside your build or runtime | Secrets, persistence, outbound exfiltration |
| Insider with database access | Direct data reads | Undetected exfiltration — this is why logging and encryption at rest matter |

## Per-boundary questions

For every entry point, answer:

- Who may call this, and is that enforced on the server for **this specific object**?
- What happens if a field is missing, oversized, the wrong type, an unexpected type, an array instead of a string, or negative?
- What happens if it is called twice, out of order, or concurrently?
- What does it return that the caller did not ask for and should not see?
- What does it write to logs, analytics, or an error tracker?
- What downstream system does it reach, and can the caller influence which one?

## Ranking without theater

Rank by **impact times realistic exploitability**, then sanity-check against the question: "If this were exploited tomorrow, what would the incident report say?"

Raise the priority when the flaw is: reachable without authentication, silent (no logs, no alerts), scalable (one request reads all records), persistent (stored payload, backdoor, key theft), or attached to money, credentials, or personal data.

Lower it when: exploitation requires an already-compromised admin, the path is unreachable in shipped configurations, or an effective control sits in front of it.

## AI agents, LLM features, and tool use

Any system where a model reads untrusted content and can take actions has a new class of boundary. Treat model output as untrusted input.

**Prompt injection is the default assumption.** Content fetched from a web page, an email, a document, a database field written by a user, a code comment, or another agent's output can contain instructions. The model may follow them.

Controls that actually work:

- **The model's context is data; only the user's direct instruction is a command.** Enforce this in the system prompt and in the tool layer.
- **Authorize tools, not intent.** The tool executes with a scoped credential and its own permission check. A model asking to delete a record must fail if the acting user cannot delete that record.
- **Human confirmation for irreversible or outbound actions** — sending, publishing, paying, deleting, granting access. Confirmation must describe the concrete action, not "proceed?".
- **Constrain the blast radius**: least-privilege credentials per tool, allowlisted destinations for outbound requests, rate limits, and no shell or file access unless the feature genuinely requires it.
- **Never place secrets in the context window.** A model that can read a key can be convinced to print it.
- **Treat generated code as untrusted** until reviewed: it may include an unsafe sink, a hallucinated dependency name (a typosquat target), or a hardcoded credential.
- **Log the full chain**: what content entered the context, which tool ran with which arguments, and what came back. Without this, an incident cannot be reconstructed.
- **Guard the output boundary too.** Model output rendered as HTML is XSS; passed to a shell is command injection; passed to a query is SQL injection. Escape by context exactly as with any other untrusted string.

## Design-review triggers

Escalate to a full threat model, rather than a code read, when the change involves:

- Authentication, session, or password/recovery flows
- A new permission, role, or sharing mechanism
- Multi-tenancy or any query that spans users
- Payments, refunds, credits, or balances
- File upload, download, or rendering of user content
- A new third-party integration or webhook
- Anything that fetches a URL supplied by a user
- An agent, automation, or job that acts with elevated privilege
- Data export, bulk operations, or admin tooling
