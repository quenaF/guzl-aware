# WebMCP Tool Contract — v0

The challenge implementation will use the WebMCP Imperative API (`document.modelContext.registerTool`). Tool names are intentionally narrow and action-oriented.

## Read-only experience tools

### `get_experience_context`
Returns the experience intent, relevant known facts, unknowns, non-inference boundaries, and available paths for the current booking moment.

Input: current booking id.

### `get_decision_context`
Returns the decision boundary for a proposed action, including whether explicit human confirmation is required and what consequence should be made clear before execution.

Input: booking id + proposed action.

### `clarify_uncertainty`
Checks a human-provided piece of context against the contract and returns what remains unknown plus any newly relevant available paths. It must not infer a reason from sentiment or tone.

Input: booking id + context explicitly supplied by the human.

### `get_human_support_options`
Returns available human-support routes when the supplied context matches an explicit support boundary. It does not diagnose or classify the human.

Input: booking id + context explicitly supplied by the human.

### `report_experience_friction`
Records structured, non-sensitive feedback about a point of friction in the demo experience. This is the one experience tool that may write feedback; implementation must clearly mark it state-changing rather than read-only.

Input: booking id + friction category + optional user-authored note.

## Transaction tool

### `cancel_booking`
Cancels the fictional booking only after explicit confirmation is represented in the tool input. This is deliberately separate from the experience-context surface.

Input: booking id + `confirmed: true`.

If confirmation is absent or false, execution must fail safely without changing booking state.

## Annotation policy

- Pure context/lookup tools use `readOnlyHint: true`.
- State-changing tools use `readOnlyHint: false`.
- User-authored free text is treated as untrusted content where applicable.
- Tool outputs stay concise and structured enough for subsequent agent decisions.

## Why WebMCP

These capabilities should be discoverable at the moment an agent is acting on the website. The browser agent should not need to infer experience policy from visual copy, scrape hidden instructions, or reverse-engineer UI behavior. WebMCP provides the structured, page-local capability contract; guzl-aware adds structured experience intent to that surface.
