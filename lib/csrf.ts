import { NextRequest } from "next/server";

/**
 * Kiểm tra Origin/Referer header khớp với host hiện tại để chặn CSRF.
 * Trả về true nếu request hợp lệ (same-origin hoặc allowed origin).
 */
export function validateOrigin(req: NextRequest): boolean {
  const host = req.headers.get("host");
  if (!host) return false;

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  // Fallback: kiểm tra Referer (ít tin cậy hơn nhưng vẫn có giá trị)
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  return false;
}
