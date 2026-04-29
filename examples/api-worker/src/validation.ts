import { ERROR_CODES, errorResponse, type RequestContext } from "./errors";

export type AskRequest = {
  q: string;
  turn: number;
  hints?: string[];
};

export type AdminCreatePuzzleRequest = {
  title: string;
  category: "person" | "place" | "thing";
  canonicalAnswer: string;
  aliases?: string[];
};

type ValidationSuccess<T> = {
  ok: true;
  value: T;
};

type ValidationFailure = {
  ok: false;
  response: Response;
};

export async function readJson(
  request: Request,
  ctx: RequestContext,
): Promise<ValidationSuccess<unknown> | ValidationFailure> {
  try {
    return {
      ok: true,
      value: await request.json(),
    };
  } catch {
    return {
      ok: false,
      response: errorResponse(
        ctx,
        400,
        ERROR_CODES.INVALID_JSON,
        "Request body must be valid JSON",
      ),
    };
  }
}

export function validateAskRequest(
  body: unknown,
  ctx: RequestContext,
): ValidationSuccess<AskRequest> | ValidationFailure {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return invalidPayload(ctx, "Request body must be a JSON object");
  }

  const candidate = body as Record<string, unknown>;
  const q = typeof candidate.q === "string" ? candidate.q.trim() : "";
  const turn = candidate.turn;
  const hints = Array.isArray(candidate.hints)
    ? candidate.hints.filter((value): value is string => typeof value === "string")
    : [];

  if (!q) {
    return invalidPayload(ctx, "Field 'q' is required");
  }

  if (typeof turn !== "number" || !Number.isInteger(turn) || turn < 1) {
    return invalidPayload(ctx, "Field 'turn' must be a positive integer");
  }

  return {
    ok: true,
    value: { q, turn, hints },
  };
}

export function validateAdminCreatePuzzleRequest(
  body: unknown,
  ctx: RequestContext,
): ValidationSuccess<AdminCreatePuzzleRequest> | ValidationFailure {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return invalidPayload(ctx, "Request body must be a JSON object");
  }

  const candidate = body as Record<string, unknown>;
  const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
  const canonicalAnswer =
    typeof candidate.canonicalAnswer === "string"
      ? candidate.canonicalAnswer.trim()
      : "";
  const category = candidate.category;
  const aliases = Array.isArray(candidate.aliases)
    ? candidate.aliases.filter((value): value is string => typeof value === "string")
    : undefined;

  if (!title) {
    return invalidPayload(ctx, "Field 'title' is required");
  }

  if (!canonicalAnswer) {
    return invalidPayload(ctx, "Field 'canonicalAnswer' is required");
  }

  if (category !== "person" && category !== "place" && category !== "thing") {
    return invalidPayload(ctx, "Field 'category' must be person, place, or thing");
  }

  return {
    ok: true,
    value: {
      title,
      category,
      canonicalAnswer,
      aliases,
    },
  };
}

function invalidPayload(ctx: RequestContext, message: string): ValidationFailure {
  return {
    ok: false,
    response: errorResponse(ctx, 400, ERROR_CODES.INVALID_PAYLOAD, message),
  };
}
