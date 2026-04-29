# Validation And Auth

## API Boundary Validation

The Worker validates requests at the HTTP boundary before handing them to game logic. In the current implementation this includes checks such as:

- required JSON fields for gameplay endpoints
- content type checks for admin endpoints
- route and method handling
- consistent JSON error responses

This matters because the API relies on small structured payloads and then uses those payloads to drive LLM calls and game-state decisions.

The same principle continues after the request enters the LLM flow: the system is designed to work with structured parse output that can be checked and routed by application logic, instead of relying on unconstrained model prose.

## Admin Route Protection

Admin-prefixed routes are protected using a bearer-token/shared-secret pattern in the current Worker. The authorization check compares the `Authorization` header against an expected admin secret stored in the runtime environment.

That is a reasonable MVP control for internal tooling, but it is intentionally lightweight. It is not presented here as a full production auth system.

## MVP Vs Production Tradeoffs

The current approach is practical for a private or early-stage deployment:

- simple request validation keeps the API predictable
- shared-secret admin protection keeps internal routes off the public path
- structured parse output makes natural-language input easier to handle safely
- structured error objects make frontend handling easier

For a more production-hardened version, you would typically expect stricter schema validation, stronger authn/authz for admin access, persistent storage-backed controls, and more complete rate limiting and observability.
