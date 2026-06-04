import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/studio")) {
    // Chỉ cho phép truy cập studio trong môi trường development
    // hoặc khi có STUDIO_ACCESS_TOKEN đúng trong header/query
    const isProduction = process.env.NODE_ENV === "production";
    const accessToken = request.nextUrl.searchParams.get("token");
    const studioToken = process.env.STUDIO_ACCESS_TOKEN;

    if (isProduction && (!studioToken || accessToken !== studioToken)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/studio/:path*",
};
