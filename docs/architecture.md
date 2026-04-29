# Architecture

WhoAmMAI is organized as a small web application backed by a serverless API. The public gameplay flow is intentionally simple:

1. The client requests the current puzzle metadata from the API.
2. The client sends player input to the API.
3. The API validates the request and sends the input through a structured parsing step.
4. The API uses the parsed result to decide how to handle the turn.
5. The API calls an LLM provider for a constrained gameplay response when needed.
5. The client uses that response to continue the question-and-answer loop and eventually resolve the round.

## High-Level Components

### Client

The repository includes a web client and an admin client. The public gameplay client is responsible for rendering the game loop, collecting player input, and handling structured API responses.

### API

The backend runs on Cloudflare Workers. It exposes HTTP routes for gameplay and placeholder admin functionality. The Worker also owns:

- CORS handling
- request parsing
- input validation
- error response formatting
- structured LLM parse orchestration
- LLM provider selection
- gameplay response orchestration

### LLM Layer

The LLM integration is abstracted behind a provider interface. This keeps the API logic stable even if the underlying model or vendor changes later.

The more important design choice is that the Worker does not rely on free-form model output alone. It first asks the model for structured parse results, then uses application logic to decide what happens next.

### Data Flow

At a high level, the intended data flow is:

- The Worker provides puzzle/session metadata to the client.
- Player input is sent to the Worker as structured API requests.
- The Worker validates input and passes it through an LLM parsing step.
- Parsed input is checked and used to drive answer generation and gameplay decisions.
- Responses are returned as compact JSON objects the client can render deterministically.

As an MVP, some implementation details are still evolving, but the architectural direction is already clear: keep the game loop server-driven, make parsing a first-class step, validate data at boundaries, and keep the client simple.

## Why Cloudflare Workers

Cloudflare Workers fit this project well because the API is request-driven, lightweight, and latency-sensitive. The serverless model reduces operational overhead, works well for a small interactive game, and makes it straightforward to pair the API with Cloudflare-hosted frontend deployments.
