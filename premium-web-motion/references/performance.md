# Motion performance and accessibility

Use for costly or complex motion, accessibility reviews, and any performance claim. Record the scenario and environment before changing implementation.

## Rendering costs

| Property / technique | Likely cost | Decision |
| --- | --- | --- |
| Transform, opacity | Often compositor eligible; layer allocation, rasterization, and large surfaces still matter | Start here, then inspect the trace |
| Filter, backdrop filter, shadow, clip effects | Cost varies with browser, effect, and painted area | Measure; consider a static effect with an opacity transition |
| Height, width, positions, margins, grid tracks | Layout and potentially paint of affected content | Use deliberately for actual reflow; constrain scope and profile |
| FLIP / shared layout | Measurement at state changes plus animated transforms | Batch reads/writes; preserve identity and handle interruption |

Do not replace real layout change with scale when it distorts text, preserves unwanted layout space, or creates hit-testing surprises. A short measured disclosure can be better than an elaborate transform workaround.

A 60Hz display refreshes about every 16.7ms; 120Hz about every 8.3ms. This is total frame time, not a JavaScript allowance. Main-thread tasks below 50ms can still miss several frames. Select a budget from the target device and interaction rather than declaring a universal 8–10ms allowance.

The [browser animation guide](https://web.dev/articles/animations-guide) explains why rendering stages and compositing matter. Treat its property guidance as a starting point, not a guarantee for a particular page.

## Reads, writes, and scroll

Layout-sensitive reads after invalidating writes can force synchronous calculation. Batch all starting measurements, apply the state/layout mutation, batch all final measurements, then start effects. Do not interleave final reads with animation writes in a loop.

Use IntersectionObserver for visibility thresholds. For a progress fallback, cache stable geometry, invalidate it on relevant resize/content changes, and keep per-frame work small. Use requestAnimationFrame to coordinate visual writes; it does not inherently reduce the frequency of scroll events. A separate time interval can throttle lower-frequency work. Passive listeners help only for cancelable input events when default prevention is unnecessary; the scroll event itself is not cancelable. See [scroll event guidance](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event).

Do not create endless animation-frame loops for an offscreen or inactive effect. Stop work when it has no visible or functional purpose, and restore the correct state on resumption.

## Ownership and cleanup

Add will-change only when a trace demonstrates a benefit, scope it narrowly, and release it when no longer needed. It is a hint with memory costs, not a performance fix.

Release owned observers, event listeners, animation frames, timers, media-query listeners, WAAPI handles, and timelines on teardown. Observation is not automatically a memory leak; unnecessarily retained components and redundant work are the problem.

When an operation completes after cancellation, prevent it from changing a newer state. Use a generation identifier, abort signal, or handle identity check. Do not swallow every promise rejection as if it were an expected cancellation.

## Reduced motion and accessibility scope

Use the initial motion preference and subscribe to runtime changes for JavaScript effects. When reduction becomes active, settle or cancel current decorative effects into the correct semantic state. Remove travel, zoom, parallax, decorative loops, and staged delays; immediate state changes are valid. A brief fade is optional, not universally comfortable or required.

Provide motion-independent feedback, keyboard focus, and equivalent content. A static loading label or determinate value can replace a spinner; do not announce animation frames through a live region. Prefer owned component rules over an indiscriminate global override, and inspect third-party effects separately. Business logic must never require an animation event that may not fire.

Separate relevant requirements instead of claiming that a media query establishes compliance:
- [WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) is Level AAA and addresses disabling nonessential interaction-triggered motion.
- [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) is Level A. Automatically started moving, blinking, or scrolling content lasting more than five seconds alongside other content needs pause, stop, or hide controls unless essential. Auto-updating content has related controls without that five-second condition.
- Flashing is a separate hazard: avoid introducing it; assess flash thresholds if the requested content contains flashes. Reduced motion alone is not a flash-safety test.

## Web Vitals and perceptual stability

Keep important content renderable without waiting for motion initialization. An opacity-zero reveal can delay when content becomes eligible for paint metrics; do not predict an exact LCP delay from duration alone.

Reserve known media and placeholder dimensions. Unexpected layout changes can hurt CLS; some shifts near user input are excluded from the score, but can still feel disruptive. Transform movement generally does not contribute to CLS, yet can still disorient the user. See [CLS definitions and exclusions](https://web.dev/articles/cls).

Keep input handlers and their immediate render work small. A smooth animation does not prove good INP, and a good INP value does not prove smooth sustained scrolling. Measure the metric that corresponds to the reported problem.

## Verification scenarios

Select cases applicable to the changed interaction:

| Scenario | Observe |
| --- | --- |
| Open → close → reopen before exit completes | Final state follows last intent; no stale removal or invisible input blocker |
| Keyboard use while content enters/exits | Correct focus location, visible ring, no focusable hidden descendants |
| Reduce motion at startup and mid-effect | Equivalent information, no stranded partial state, current effects settle |
| Disable/delay enhancement; unsupported API | Existing content and product behavior remain available |
| Resize, zoom, change text/images during expansion | No clipping, stale height, or obscured focused control |
| Navigate away and back repeatedly | Owned work stops; no duplicate callbacks or growing retained component count |
| Scroll forward/back, jump by anchor, keyboard scroll | Native behavior and content reachability survive |
| Rapid input on representative hardware | Responsive state, bounded work, no accumulating effects |

For a performance comparison, use the same build mode, browser, viewport, device or throttle setting, data, and interaction. Capture a trace before and after when claiming improvement. Inspect long tasks, missed frames, forced layout, paint area, and retained resources relevant to the symptom.

A throttled desktop is diagnostic, not proof of mobile behavior. Name real-device testing separately. If browser execution is unavailable, report static findings and proposed verification instead of marking checks passed.
