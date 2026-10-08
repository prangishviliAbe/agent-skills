# Context Economy & Token Preservation

Read when: You are managing long-running agent interactions, budgeting tokens, presenting code diffs, or eliminating context degradation.

---

## 1. The Cost of Token Proliferation

In multi-turn agent interactions, every token emitted into the context window:
1. Increases latency for all future user requests.
2. Increases financial cost linearly.
3. Dilutes the model's attention, accelerating "context decay" and instruction forgetting.

---

## 2. Surgical Code Diffs vs. Whole-File Reprints

Always favor targeted, localized changes:

```diff partial
// BAD: Printing 200 lines to change one condition
// GOOD: Surgical unified diff
@@ -42,3 +42,3 @@
- if (user.role === 'admin') {
+ if (user.role === 'admin' || user.permissions.includes('billing:write')) {
    allowAccess();
```
