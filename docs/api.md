# API Overview

The public API is split into gameplay routes and admin-prefixed routes.

## Public Gameplay Routes

The current Worker implementation exposes these public-facing routes:

- `GET /today`
- `POST /ask`
- `POST /score`

### `GET /today`

Returns the current puzzle metadata used to initialize a play session. The response includes a `dayId`, limits, preamble text, and additional metadata from the Worker.

### `POST /ask`

Accepts player input in JSON. In the current implementation, the request includes:

```json
{
  "q": "Is it found in space?",
  "turn": 3,
  "hints": []
}
```

This route is central to the game loop:

- It validates the request shape at a basic level.
- It asks the LLM to parse the input into structured blocks.
- It uses that structured output to decide whether the turn needs more input, needs user disambiguation, or is ready for answer generation.
- It returns compact JSON response types the client can handle deterministically.

Example response shapes in the current code include:

```json
{ "type": "need_input" }
```

```json
{
  "type": "answer",
  "block": {
    "simplifiedPhrase": "Is it found in space?",
    "extractedClaim": "found in space",
    "extractedEntity": null,
    "isIdentityAttempt": false,
    "confidence": 0.9
  },
  "answer": "Yes. Ask about what people observe directly.",
  "answerMode": "answer_plus_vague_hint"
}
```

### `POST /score`

The current Worker includes a placeholder score endpoint that returns a simple success object. It is present in the API surface, but it should be treated as MVP scaffolding rather than a finalized analytics contract.

## Admin Routes

Admin functionality is grouped under `/admin`. The repository includes internal contracts and route scaffolding for admin functionality, including puzzle-management flows. This area is still in progress and should be treated as an evolving internal interface rather than a stable public product surface.

At a high level, admin routes are intended to support internal content management while remaining separate from the public gameplay API.

## Validation And Errors

The Worker returns JSON error bodies in a consistent shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message"
  }
}
```

The current code includes explicit handling for validation failures, unsupported media types, unauthorized admin access, and generic server or LLM failures. Validation is still maturing, but the API direction is clear:

- validate request shape at the boundary
- convert natural-language input into structured parse output
- use application logic to branch on that parsed result
- keep response shapes predictable and machine-readable
