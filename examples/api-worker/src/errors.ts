export const ERROR_CODES = {
  INVALID_JSON: "INVALID_JSON",
  INVALID_PAYLOAD: "INVALID_PAYLOAD",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export type RequestContext = {
  corsHeaders: Record<string, string>;
};

export function jsonResponse(
  ctx: RequestContext,
  body: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...ctx.corsHeaders,
      "content-type": "application/json",
    },
  });
}

export function errorResponse(
  ctx: RequestContext,
  status: number,
  code: ErrorCode,
  message: string,
): Response {
  return jsonResponse(ctx, { error: { code, message } }, status);
}
