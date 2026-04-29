import { ERROR_CODES, errorResponse, type RequestContext } from "./errors";

export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

export function isAdminAuthorized(request: Request, env: { ADMIN_API_KEY?: string }): boolean {
  const expectedSecret =
    typeof env.ADMIN_API_KEY === "string" ? env.ADMIN_API_KEY : null;

  if (!expectedSecret) {
    return false;
  }

  return request.headers.get("Authorization") === `Bearer ${expectedSecret}`;
}

export function requireAdmin(
  pathname: string,
  request: Request,
  env: { ADMIN_API_KEY?: string },
  ctx: RequestContext,
): Response | null {
  if (!isAdminPath(pathname)) {
    return null;
  }

  if (!isAdminAuthorized(request, env)) {
    return errorResponse(
      ctx,
      401,
      ERROR_CODES.UNAUTHORIZED,
      "Missing or invalid admin secret",
    );
  }

  return null;
}
