# Generative AI Interface Design

Read when: You are designing AI chat surfaces, streaming tokens, collapsible reasoning drawers, tool invocation cards, prompt inputs, or artifact viewers.

---

## 1. Smooth Token Streaming

Abrupt text popping creates visual jitter. Implement a smooth streaming caret and word fade-in:

```css
/* Animated breathing streaming cursor */
.ai-streaming-cursor {
  display: inline-block;
  width: 6px;
  height: 15px;
  margin-left: 4px;
  vertical-align: middle;
  background: oklch(0.65 0.22 265);
  border-radius: 2px;
  animation: cursor-pulse 0.8s infinite cubic-bezier(0.4, 0, 0.6, 1);
}

@keyframes cursor-pulse {
  0%, 100% { opacity: 1; transform: scaleY(1); }
  50% { opacity: 0.2; transform: scaleY(0.7); }
}
```

---

## 2. Collapsible Reasoning & Thinking Blocks

Extended reasoning should not overwhelm the chat thread. Present thinking processes in a subtle, collapsible accordion with real-time status:

```html partial
<details class="ai-thought-tray">
  <summary class="ai-thought-summary">
    <span class="pulse-indicator"></span>
    <span class="summary-text">Thinking process (2.4s)</span>
    <svg class="chevron-icon" viewBox="0 0 20 20"><path d="..." /></svg>
  </summary>
  <div class="ai-thought-content">
    <p>Analyzing schema constraints and validating foreign key indexes...</p>
  </div>
</details>
```

```css
.ai-thought-tray {
  margin: 12px 0;
  border-radius: 12px;
  background: oklch(0.16 0.02 260 / 0.5);
  border: 1px solid oklch(1 0 0 / 0.06);
  overflow: hidden;
}

.ai-thought-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 0.8125rem;
  color: oklch(0.65 0.02 260);
  cursor: pointer;
  user-select: none;
}

.ai-thought-tray[open] .ai-thought-summary {
  border-bottom: 1px solid oklch(1 0 0 / 0.06);
}

.ai-thought-content {
  padding: 12px;
  font-family: ui-monospace, monospace;
  font-size: 0.8125rem;
  color: oklch(0.75 0.02 260);
  line-height: 1.6;
}
```

---

## 3. Tool Execution & Inspection Pills

When an agent invokes external tools (e.g. database query, web search), display a status pill with execution duration and output inspection:

```html partial
<div class="tool-call-pill">
  <span class="tool-icon">⚡</span>
  <span class="tool-name">execute_query</span>
  <span class="tool-param">SELECT * FROM orders WHERE status = 'pending'</span>
  <span class="tool-badge success">240ms</span>
</div>
```

```css
.tool-call-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 8px;
  background: oklch(0.19 0.02 260);
  border: 1px solid oklch(1 0 0 / 0.08);
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  margin: 4px 0;
}

.tool-badge.success {
  color: oklch(0.7 0.18 145);
  background: oklch(0.7 0.18 145 / 0.12);
  padding: 2px 6px;
  border-radius: 4px;
}
```

---

## 4. Rollback & Version Branching

Generative interfaces must allow users to edit prompts and fork conversations without losing previous turns. Provide an intuitive `< 2 / 3 >` pagination widget on edited turns.
