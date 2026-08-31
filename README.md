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

## Frozen competition scope

One fictional youth-program scenario. One consequential cancellation action. Five experience-context tools. One visible human-agent loop. Evals. Deployed demo.

Anything that does not materially strengthen that end-to-end demonstration is out of scope for the challenge build.

## Status

Initial competition baseline. Implementation follows.

## License

MIT. See [LICENSE](./LICENSE).
