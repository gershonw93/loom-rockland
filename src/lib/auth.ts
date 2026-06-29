import "server-only";
import { timingSafeEqual } from "crypto";

/**
 * Constant-time check of the admin password supplied by a request against the
 * ADMIN_PASSWORD env var. Accepts the password via the `x-admin-password`
 * header or `Authorization: Bearer <password>`.
 */
export function isAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const headerPw = req.headers.get("x-admin-password");
  const auth = req.headers.get("authorization");
  const bearer = auth?.toLowerCase().startsWith("bearer ")
    ? auth.slice(7)
    : undefined;
  const provided = headerPw ?? bearer ?? "";

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
