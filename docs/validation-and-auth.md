# Validation and Auth

## API Boundary Validation

The API validates requests at the HTTP boundary before they reach any game logic. In the current implementation this includes:

- checking request shape and required JSON fields for gameplay endpoints  
- validating content type for admin endpoints  
- enforcing route and method handling  
- returning consistent, structured JSON error responses  

This approach keeps the system predictable and prevents invalid input from propagating into game logic or LLM calls.

The same principle applies within the LLM flow. Instead of relying on unconstrained model text, the system uses structured parse output that can be validated and routed by application logic.

---

## Admin Route Protection

Admin-prefixed routes are protected using Bearer token authentication backed by a shared secret.

Each request includes an `Authorization: Bearer <token>` header, which is validated at the API boundary against a known value stored in the runtime environment. Requests with missing or invalid credentials are rejected before reaching any business logic or database operations.

This approach is intentionally lightweight and appropriate for an MVP or internal tooling, rather than a full production authentication system.

---

## MVP vs Production Tradeoffs

The current approach is practical for a private or early-stage deployment:

- boundary validation keeps the API predictable and reduces error handling complexity  
- shared-secret admin protection provides a simple access control mechanism for internal routes  
- structured parse output makes natural-language input safe and machine-readable  
- structured error responses make frontend handling consistent and debuggable  

In a production system, this would typically be extended with stricter schema validation, identity-based authentication and authorization, persistent controls, and more robust rate limiting and observability.