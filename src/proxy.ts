import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSessionSecret } from "@/lib/auth/sessionSecret";

const ADMIN_EMAILS = ["igor.dolovski@gmail.com", "nikodola@gmail.com"];

// Content editing only runs locally. In production these paths 404 so the
// JSON-backed admin disappears for everyone.
const LOCAL_ONLY_PREFIXES = ["/admin/posts", "/admin/team", "/api/posts", "/api/team", "/api/upload"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && LOCAL_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), { algorithms: ["HS256"] });
    const email = payload.email as string;
    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/posts/:path*", "/api/team/:path*", "/api/upload"],
};
