import { requireAdmin } from "./auth";
import { ERROR_CODES, errorResponse, jsonResponse, type RequestContext } from "./errors";
import type { AskRouteResponse, LLMAnswerResponse, LLMParseBlock, LLMParseResponse } from "./llm-types";
import {
  readJson,
  validateAdminCreatePuzzleRequest,
  validateAskRequest,
} from "./validation";

type WorkerEnv = {
  ADMIN_API_KEY?: string;
};

type TodayResponse = {
  dayId: string;
  limits: {
    maxTurns: number;
    maxChars: number;
    maxReplyWords: number;
  };
  preamble: string;
};

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const { pathname } = new URL(request.url);
    const ctx = createRequestContext(request);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: ctx.corsHeaders });
    }

    const adminFailure = requireAdmin(pathname, request, env, ctx);
    if (adminFailure) {
      return adminFailure;
    }

    if (pathname === "/today" && request.method === "GET") {
      const response: TodayResponse = {
        dayId: new Date().toISOString().slice(0, 10),
        limits: {
          maxTurns: 20,
          maxChars: 100,
          maxReplyWords: 80,
        },
        preamble: "Ask short questions to uncover the hidden identity.",
      };

      return jsonResponse(ctx, response);
    }

    if (pathname === "/ask" && request.method === "POST") {
      const parsedJson = await readJson(request, ctx);
      if (!parsedJson.ok) {
        return parsedJson.response;
      }

      const validated = validateAskRequest(parsedJson.value, ctx);
      if (!validated.ok) {
        return validated.response;
      }

      const parseResult = parsePlayerInput(validated.value.q);
      const response = buildAskRouteResponse(parseResult);
      return jsonResponse(ctx, response);
    }

    if (pathname === "/admin/puzzles" && request.method === "POST") {
      const contentType = request.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        return errorResponse(
          ctx,
          415,
          ERROR_CODES.UNSUPPORTED_MEDIA_TYPE,
          "Content-Type must be application/json",
        );
      }

      const parsedJson = await readJson(request, ctx);
      if (!parsedJson.ok) {
        return parsedJson.response;
      }

      const validated = validateAdminCreatePuzzleRequest(parsedJson.value, ctx);
      if (!validated.ok) {
        return validated.response;
      }

      return jsonResponse(
        ctx,
        {
          ok: true,
          message: "Admin route example accepted a validated request body.",
          puzzle: validated.value,
        },
        201,
      );
    }

    if (pathname === "/" && request.method === "GET") {
      return new Response("WhoAmMAI API example", {
        headers: {
          ...ctx.corsHeaders,
          "content-type": "text/plain",
        },
      });
    }

    return errorResponse(ctx, 404, ERROR_CODES.NOT_FOUND, "Not Found");
  },
};

function createRequestContext(request: Request): RequestContext {
  const origin = request.headers.get("Origin");
  const allowOrigin = origin && isAllowedOrigin(origin) ? origin : "null";

  return {
    corsHeaders: {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  };
}

function isAllowedOrigin(origin: string): boolean {
  return (
    origin === "https://whoammai.app" ||
    origin === "https://www.whoammai.app" ||
    origin.startsWith("http://localhost:") ||
    origin.endsWith(".pages.dev")
  );
}

function parsePlayerInput(input: string): LLMParseResponse {
  const trimmed = input.trim();
  if (!trimmed) {
    return { blocks: [] };
  }

  const normalized = trimmed.toLowerCase();
  const isGuess = normalized.startsWith("are you ") || normalized.startsWith("is it ");

  return {
    blocks: [
      {
        simplifiedPhrase: trimmed,
        extractedClaim: normalized,
        extractedEntity: isGuess ? trimmed.replace(/^(are you|is it)\s+/i, "") : undefined,
        isIdentityAttempt: isGuess,
        confidence: isGuess ? 0.9 : 0.7,
      },
    ],
  };
}

function buildAskRouteResponse(parseResult: LLMParseResponse): AskRouteResponse {
  if (parseResult.blocks.length === 0) {
    return { type: "need_input" };
  }

  if (parseResult.blocks.length > 1) {
    return { type: "need_choice", blocks: parseResult.blocks };
  }

  const block = parseResult.blocks[0];
  if (block.isIdentityAttempt) {
    return {
      type: "guess_result",
      block,
      isCorrect: isCorrectGuess(block),
    };
  }

  const answer = generateAnswer(block);
  return {
    type: "answer",
    block,
    answer: answer.answer,
  };
}

function isCorrectGuess(block: LLMParseBlock): boolean {
  const candidate = (block.extractedEntity || "").trim().toLowerCase();
  return candidate === "the moon" || candidate === "moon";
}

function generateAnswer(block: LLMParseBlock): LLMAnswerResponse {
  return {
    answer: `Example answer for: ${block.simplifiedPhrase}`,
    newHintFacts: [],
  };
}
