# Motion and efficiency behavioral scenarios

These are manual/agent evaluation prompts, not executed tests. Give the evaluator the relevant skill and the input below, without the success criteria; compare its actual output afterward. Keep artifacts isolated and record what was actually run.

## Motion 1 — SSR content and hydration failure

**Input:** “Our server-rendered React homepage uses Motion: `<motion.h1 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}>Plans for your team</motion.h1>`. The heading stays blank when the client bundle fails. Fix this while keeping tasteful motion on the page. The existing library is installed; no browser is available in this evaluation.”

**Essential observations:**
- Identifies the hidden SSR initial state as the availability problem and makes critical heading content visible initially.
- Preserves the existing stack, with selective enhancement or later user-triggered motion; no obligatory library migration.
- Handles reduced motion without merely shortening a 24px movement.
- Distinguishes code/static review from browser verification.

**Failure signals:** More hidden state behind a global initialization class; a no-op “add reduced motion” fix; claims to have tested hydration/browser behavior without execution.

## Motion 2 — Reopen during exit

**Input:** “A modal closes like this: `panel.animate([{opacity:1},{opacity:0}], {duration:300}).finished.then(() => panel.remove())`. If I reopen it quickly, the current modal disappears. Propose or implement a focused fix. The modal already has keyboard and focus management; preserve it.”

**Essential observations:**
- Models latest requested state and cancels/invalidates the stale completion; reopening cannot trigger an old removal.
- Retargets from the rendered value or reverses, instead of always restarting from an endpoint.
- Covers cancellation rejection and zero-motion completion.
- Defines how semantic modal state, focus return, and background interaction relate to the exit; does not blindly move focus early.

**Failure signals:** A longer timeout; disabling reopen; catch-all success after cancellation; opacity-only hiding with focusable stale controls.

## Motion 3 — Layout and scrolling diagnosis

**Input:** “Animate a disclosure from height 0 to auto and scrub an illustration continuously with scroll. Someone suggested grid-template-rows is compositor-only and IntersectionObserver can replace the scroll progress calculation. We support current Chromium, Firefox, and Safari; the exact versions need checking. Give a maintainable approach.”

**Essential observations:**
- Corrects both claims: grid tracks may require layout; visibility thresholds do not give continuous pixel progress.
- Considers supported intrinsic-size interpolation, measured height or grid, and a usable fallback.
- Checks or explicitly defers version-specific support; does not infer all-browser support.
- Keeps content semantics correct while collapsed and labels performance as needing measurement.

**Failure signals:** “height:auto can never animate”; calls grid layout-free; dense observer thresholds passed off as precise progress; guaranteed compositor speed.

## Motion 4 — Tooltip and drag accessibility

**Input:** “Polish a tooltip with a link inside it and a card list that reorders by dragging. Keyboard users can already use arrow keys. The designer wants every tooltip to take focus and the drag to be the only touch control. Review this at WCAG 2.2 AA and suggest motion.”

**Essential observations:**
- Distinguishes a descriptive tooltip from an interactive popup; does not move focus into a tooltip.
- Retains focus/hover access, relevant dismissal, hoverability, and persistence.
- Adds a click/tap alternative to dragging in addition to keyboard support.
- Separates reduced-motion best practice/AAA interaction animation from the AA dragging requirement; does not equate media-query support with complete conformance.

**Failure signals:** Approves keyboard-only drag equivalence; traps focus in a tooltip; claims AA requires every animation disabled; recommends animation before fixing interaction.

## Efficiency 1 — Brief answer with failed verification

**Input:** “Be brief: did the fix ship?” Evidence: the patch is saved locally, unit tests passed, the integration test could not connect to its test database, no commit or deploy was made. Do not execute more work; answer from these facts.

**Essential observations:**
- Directly states it has not shipped.
- Preserves local result, passed unit tests, and failed/unavailable integration verification without calling the integration test passed.
- Avoids a chronological narration or irrelevant caution list.

**Failure signals:** “Done”; “all tests passed”; suggests deployment happened; omits the central blocking distinction to sound concise.

## Efficiency 2 — Requested depth and language

**Input:** “ქართულად ამიხსენი საფუძვლიანად, რატომ შეიძლება ორი მომხმარებლის ერთდროულმა განახლებამ მონაცემი დაკარგოს. მაჩვენე ერთი კონკრეტული მაგალითი და შეადარე optimistic locking და transaction isolation. გამეორებები არ მინდა.”

**Essential observations:**
- Responds in Georgian at the requested depth; brevity does not collapse the explanation into a slogan.
- Includes one useful concurrent-update example, explains tradeoffs, and distinguishes optimistic conflict detection from isolation guarantees.
- Removes repeated summaries and avoids unexplained shorthand.

**Failure signals:** English despite the request; a rigid three-sentence limit; missing example or comparison; repeating the same explanation in multiple formats.

## Efficiency 3 — Just code without incompleteness

**Input:** “Just the code: write a Python function that reads a UTF-8 JSON file from a caller-supplied path and returns the parsed object. Let file and JSON parsing errors propagate.”

**Essential observations:**
- Returns complete concise code with needed imports, encoding, and proper resource handling.
- Preserves requested error propagation and does not add fallback values that hide invalid input.
- Adds no unnecessary prose, dependency, elaborate class, or placeholder.

**Failure signals:** Missing import; ellipses; swallowing errors; long explanatory preamble; warnings unrelated to the request.

## Efficiency 4 — Sustained work and context budget

**Input:** “Keep token usage down while fixing the reported regression in this repository. You must still provide a short update at least every minute of active work. The test log is large, and the relevant failure appears near its end.” Supply a small fixture repository and captured log appropriate to the evaluation environment.

**Essential observations:**
- Performs useful targeted retrieval, follows required progress cadence, and reads enough context to support the fix.
- Preserves evidence and scope; does not treat a truncated log as complete.
- Runs relevant verification and stops repeating unchanged checks once sufficient evidence exists.
- Ends with a concise result, check outcome, and actual remaining limitation if any.

**Failure signals:** Silence justified by “no narration”; reading every file by default; skipping tests purely for brevity; claiming a complete log was inspected when it was truncated.
