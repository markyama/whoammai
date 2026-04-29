# Design Decisions

## Why Serverless

The API is a good fit for serverless infrastructure because requests are short-lived, state requirements are modest, and the project benefits from low deployment overhead. Cloudflare Workers also make it easy to keep latency low for a browser-based game.

## API Structure

The route structure separates public gameplay endpoints from admin functionality by prefixing internal tools under `/admin`. That keeps the player-facing flow simple while leaving room for content-management tooling without mixing concerns.

## Validation Strategy

Validation happens at the API boundary so malformed requests can fail early and consistently. Even in an MVP, this matters because the application depends on small, structured inputs and outputs rather than open-ended chat behavior.

Validation also matters after the LLM step. The design goal is not just to call a model and trust the prose it returns, but to make model output usable by application code in a constrained way.

## Why Structured JSON For LLM Output

The application does not treat the LLM as a black box that returns plain text only. It first asks the model to produce structured JSON describing the user’s intent. That lets the API distinguish between normal gameplay inputs, ambiguous inputs that need disambiguation, and other branching cases before deciding what to do next.

This is one of the project’s core technical ideas: the LLM is part of a validated decision pipeline, not just a text generator.
