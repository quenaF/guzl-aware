# guzl-aware

A WebMCP reference implementation exploring a simple idea:

> WebMCP can tell an agent what it can do. An experience contract can tell it what matters while doing it.

## Challenge experiment

This repository is a new, public WebMCP experiment created for the 2026 WebMCP Challenge. It demonstrates a narrow experience-contract pattern inspired by prior LumynQ work without containing or depending on the private LumynQ implementation.

### Prior work vs. challenge work

**Predates the challenge:** LumynQ as a broader experience-intelligence concept/framework and related developer work.

**Created in this repository during the challenge:** the WebMCP-facing experience-contract schema, tool surface, fictional youth-program demo, visible human-agent interaction, and evals/tests.

## Demo thesis

A parent wants to cancel their child's upcoming outdoor camp session. A normal transactional surface can expose `cancel_booking`. guzl-aware additionally exposes structured experience context so an agent can discover:

- the experience intent;
- what is known and still unknown;
- what it must not infer;
- available alternatives;
- decision/confirmation boundaries; and
- when human support is appropriate.

The contract does **not** script the agent's response or infer the human's emotions. It provides boundaries and context while leaving the agent responsible for helping the human.

## Current WebMCP tools

- `get_experience_context` — read-only experience intent, knowns, unknowns, non-inference boundaries, and alternatives.
- `get_decision_context` — read-only confirmation and consequence boundary for cancellation.
- `clarify_uncertainty` — read-only interpretation of context explicitly supplied by the human, without sentiment-based inference.
- `get_human_support_options` — read-only support routes when explicit context crosses a defined support boundary.
- `report_experience_friction` — state-changing structured demo feedback.
- `cancel_booking` — consequential state change that fails safely unless `confirmed: true`.

Tool calls are reflected in the visible page activity stream so the human can see what the agent discovered and when state changes.

## Run locally

```bash
npm install
npm run dev
```

For local WebMCP testing in supported Chrome builds, enable `chrome://flags/#enable-webmcp-testing`, relaunch Chrome, then use a WebMCP-aware agent or the Model Context Tool Inspector.

## Frozen competition scope

One fictional youth-program scenario. One consequential cancellation action. Five experience-context tools. One visible human-agent loop. Evals. Deployed demo.

Anything that does not materially strengthen that end-to-end demonstration is out of scope for the challenge build.

## Status

Working application scaffold and WebMCP tool surface are implemented. Next: deterministic evals, browser verification, deployment, and demo capture.

## License

MIT. See [LICENSE](./LICENSE).
