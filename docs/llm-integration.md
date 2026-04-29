# LLM Integration

WhoAmMAI uses the LLM in two distinct ways:

1. To parse player input into structured intent blocks.
2. To generate short player-facing answers suitable for the game loop.

The parsing step is the more important architectural role. It gives the API a structured intermediate representation that application code can inspect before any answer is generated.

## High-Level Flow

1. The client sends player input to `POST /ask`.
2. The API sends that input to a parsing prompt.
3. The parser returns structured JSON describing one or more intent blocks.
4. The API inspects and validates that structured output.
5. The API uses that structured result to decide how to handle the turn.
6. The normalized gameplay input is sent to the answer-generation prompt.
7. The answer is returned to the client in a structured API response.

## Why Structured JSON Is Required

Structured JSON is important here because the game needs deterministic application behavior around inherently fuzzy natural language. The API needs to know whether the player is asking a straightforward question, combining multiple intents in one message, or sending something ambiguous enough to require clarification. A plain-text LLM response would make that branching logic much harder to trust.

In other words, parsing is not just a convenience feature. It is the mechanism that turns raw user language into something the rest of the system can validate and act on.

## Prompt To Response To Validation To Usage

- Prompting: the Worker builds prompts for both parsing and answer generation.
- Response: the LLM provider returns either parse blocks or answer text plus optional usage metadata.
- Validation: the application expects structured parse output and then uses code-level branching to decide how to handle it.
- Usage: the validated result becomes one of the game’s response types, such as `need_input`, `need_choice`, or `answer`.

## Provider Abstraction

The codebase uses an LLM provider interface so the game logic is not tightly coupled to a single vendor. That abstraction makes it easier to change model backends over time without rewriting the application architecture.
