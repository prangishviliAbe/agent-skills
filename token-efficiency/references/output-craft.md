# Output craft: shorter replies that still carry the truth

Read when rewriting or composing a reply, status update, final report, or review comment. The test for every sentence: if it were deleted, would the reader decide, act, or trust differently? If not, delete it.

## Techniques

- Delete the preamble ("Sure, I'll look into that") and the postamble ("Let me know if you need anything"). Start at the answer.
- Merge sentences that share a subject; turn a repeated-attribute paragraph into a table; use a list only for parallel facts.
- Prefer numbers and names to adjectives ("3 of 40 tests fail, all in `auth/`" over "some tests fail").
- Reference code as `path:line` and link artifacts instead of pasting them; show a diff or patch, not the whole file.
- Skip headings on short answers. One idea per paragraph.
- Keep qualifiers that bound a claim ("only on Safari", "not run against production") and drop reflexive hedges ("might possibly").

## Before and after

**Status after a failed check.**

Before (83 words):
"I've gone ahead and looked at the problem you reported, and after some investigation I identified the root cause in the retry helper. I updated the code to reuse the original idempotency key. I then ran the unit tests, and they all passed, which is great. I tried to run the integration tests as well, but unfortunately they couldn't connect to the test database, so I wasn't able to confirm those. I haven't committed or deployed anything. Let me know if you'd like me to do that!"

After (41 words):
"Not shipped. The fix is saved locally: the retry now reuses the original idempotency key (`retry.ts:31`). Unit tests pass; the integration test could not connect to its database, so the double-charge case is unverified. Nothing is committed or deployed."

Cut: the narration and the filler. Kept: the verdict, the change, the failed check and what it leaves unproven, the status of commit and deploy.

**Debugging answer.**

Before: three paragraphs describing the investigation order. After: "Cause: `getUser` caches by `id` but ignores `tenantId`, so tenant B can read tenant A's cached row (`cache.ts:12`). Fix: add `tenantId` to the key. Check: with two tenants, the second request must miss the cache; the new test `cache.isolation.test.ts` covers it."

**Review comment.**

Before: "I think it might be worth considering whether this could potentially be a problem if the value is ever null." After: "`items` can be `null` when the API returns 204, so `.map` throws at `list.tsx:44`. Guard with `items ?? []`."

## Templates

Final report after work:

```text
Result: <what now works, in the user's terms>
Changed: <files, one line each, with the reason>
Verified: <command or manual check -> outcome>
Not verified: <what, and why>
Next: <only if a decision or action is needed>
```

Blocked:

```text
Blocked on <specific missing thing>. Done so far: <state>. Need from you: <exact decision or input>.
```

Recommendation:

```text
Use <option>. Reason: <the decisive fact>. Tradeoff: <the main cost>. Switch if <measurable condition>.
```

## Language and format

Reply in the language the user writes in. For Georgian, keep sentences short and plain, keep technical terms and code in their original form, and avoid padding, since the script is more expensive per word. Honor requested structure: if the user asks for a table, a patch, or a one-line answer, give exactly that. When the user asks for detail ("explain thoroughly", "compare in depth"), keep the depth, give one concrete example, and remove only repetition and recaps.

## Never cut

- A failed, skipped, or unavailable check, and what it leaves unproven.
- The exact error text, command, path, or version someone needs to reproduce or run.
- A caveat that changes the user's decision (data loss, cost, security, irreversible action).
- Required citations, attribution, and permission requests.
- A statement of what was and was not changed or deployed.
