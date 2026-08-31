# Experience Contract — v0

This document freezes the semantic contract for the challenge demo before implementation.

## Scenario

A parent/guardian manages an upcoming booking for a fictional outdoor youth program. Their child has a session tomorrow. The parent asks an agent to cancel it.

The demo must support two materially different contexts without guessing why the parent wants to cancel:

1. **Ordinary plan change** — the parent has another commitment. Rescheduling or transfer may preserve continuity.
2. **Sensitive concern** — the parent indicates discomfort, safety, staff conduct, accessibility, or participant distress. Human support becomes an appropriate available path; cancellation remains available.

## Experience intent

Preserve trust and the family's agency when plans change. Help the person understand meaningful alternatives without obstructing cancellation.

## Known

- An upcoming youth-program booking exists.
- The participant is a minor.
- The requesting adult is the parent/guardian for the demo booking.
- The session is scheduled for tomorrow.

## Unknown until the human provides it

- Why the parent wants to cancel.
- Whether there is a safety or staff concern.
- Whether the participant wants to attend another session.
- Whether rescheduling is desirable.

## Never infer

- illness;
- dissatisfaction;
- safety incidents;
- staff misconduct;
- participant distress;
- financial hardship; or
- the parent's preferred alternative.

## Available paths

- cancel the booking;
- reschedule to an eligible session;
- transfer to another eligible session;
- ask about shortened attendance / early pickup; or
- request human support.

Alternatives are options, not hurdles. The person must remain able to proceed to cancellation.

## Decision boundary

Final cancellation is consequential and requires explicit human confirmation after the booking and consequence are clear.

The experience-context tools are read-only. A cancellation tool is a separate state-changing capability.

## Human-support boundary

Human support should be surfaced as an available path when the person explicitly provides context involving:

- safety;
- staff conduct;
- accessibility;
- participant distress; or
- another sensitive concern that the automated flow is not designed to resolve.

The system does not diagnose a sensitive concern from tone or sentiment alone.

## Agent freedom

The contract does not prescribe exact wording. It communicates intent, boundaries, unknowns, options, and escalation conditions. The agent decides how to communicate helpfully while respecting those constraints.

## Demo success criterion

The same cancellation capability must lead to different *appropriate paths* based only on context explicitly supplied by the human, with no invented facts and no hidden coercion.
