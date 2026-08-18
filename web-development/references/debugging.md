# Debugging: from symptom to root cause

Read when something is broken, regressed, intermittent, or "works locally".

Debugging is not guessing edits until the symptom disappears. It is narrowing the space where the truth can hide until only one explanation survives.

## The loop

1. **Reproduce deterministically.** No fix begins before the failure can be triggered on demand. Write down the exact input, actor, environment, and steps. If it only fails sometimes, find what differs between the runs (timing, order, cache, data, concurrency, locale, timezone).
2. **Capture the actual evidence.** The real error message, the real stack trace, the real request and response, the real query, the real value. Not a paraphrase, not your assumption about what it contains.
3. **State the expected value at each stage** of the path, then measure the actual value at each stage. The first place they diverge is the bug's neighborhood, and everything downstream of it is a symptom.
4. **Bisect the space**, do not scan it. Half the pipeline, half the data set, half the commits (`git bisect`), half the config. Each measurement should eliminate roughly half of what remains.
5. **Form one falsifiable hypothesis** and design the cheapest test that can prove it *wrong*. A test that only confirms your theory teaches nothing.
6. **Find the root cause, and be able to explain the mechanism.** "It works now" without a mechanism means it will come back under a different name.
7. **Fix at the cause**, then re-run the original reproduction.
8. **Add a regression test that fails without the fix.** Verify it fails when you revert the fix. A regression test that passes either way is decoration.
9. **Check the blast radius.** The same mistake usually exists in three other places. Grep for the pattern.

## Narrowing questions

- Did this ever work? What changed between then and now — code, dependency, data, config, infrastructure, or the clock?
- Does it fail for all users or one? All records or one? All environments or one?
- Is it deterministic or intermittent? Intermittent almost always means concurrency, caching, ordering, network, time, or uninitialized state.
- Is the wrong value produced, or is the right value lost in transit?
- Does the failure survive a cache clear, a fresh session, an incognito window, a rebuilt dependency tree?

## "It works locally"

Compare these axes in order. The difference is nearly always in this list:

| Axis | What to check |
| --- | --- |
| Data | Volume, nulls, legacy rows, encodings, real user content versus fixtures |
| Environment | Env vars, feature flags, secrets, service versions, region |
| Build | Dev versus production build, tree-shaking, minification, source maps, environment-specific dead-code elimination |
| Timing | Cold start, network latency, slower disk, rate limits, timeouts |
| Concurrency | One user locally, many in production |
| Caching | Browser, CDN, page cache, object cache, framework data cache |
| Case sensitivity | A case-insensitive local filesystem hiding a wrong import path |
| Time and locale | Server timezone, DST, locale-dependent parsing or sorting |

## Instrumentation over speculation

- Add temporary, high-signal logging at the boundaries you are narrowing between. Include the correlation ID, the input, and the decision taken.
- Log the shape and the value, not just "here". `console.log('here')` costs a cycle and teaches nothing.
- Use a real debugger with breakpoints for control-flow problems, and the network panel for contract problems.
- For performance, profile. Never optimize a function because it "looks slow".
- Remove all temporary instrumentation before delivering, or convert it into permanent structured logging on purpose.

## Reading a stack trace

Read from the top for **what** failed, and from your own frames for **why**. The topmost frame is usually inside a library, and the library is usually not the bug: your frame that called it with the wrong value is. Follow the trace until it enters code you own.

For an async trace, the useful context is often the enclosing operation rather than the microtask boundary. Preserve the original error when rethrowing (`cause`), never replace it with a generic message.

## Anti-patterns

| Anti-pattern | Why it fails | Do instead |
| --- | --- | --- |
| Changing several things at once | You cannot attribute the outcome | One variable per measurement |
| Adding `try/catch` to make an error disappear | Moves the failure somewhere less visible | Handle the actual condition |
| `setTimeout` to fix a race | Turns a bug into an intermittent bug | Await the real signal |
| "Restart and see" | Hides state corruption | Reproduce first, then fix |
| Rewriting the file that seems suspicious | Loses the evidence, may not touch the cause | Narrow to the failing line first |
| Trusting the error message alone | Errors are often reported far from their cause | Trace the value backwards |
| Declaring it fixed without re-running the repro | The most common false report | Re-run the original steps |

## Incident mode

When production is affected, order changes: **stop the bleeding first, understand second.**

1. Reduce user impact: roll back, disable the feature flag, block the bad input, scale up, or fail over.
2. Preserve evidence before wiping state: logs, a snapshot, the failing payload, the queue contents.
3. Then run the normal loop on the preserved evidence.
4. Close with a written cause, the permanent fix, the detection gap that let it reach production, and the guard that prevents recurrence.
