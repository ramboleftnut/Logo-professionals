import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_EMAILS = ["igor.dolovski@gmail.com", "nikodola@gmail.com"];
const SECRET = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET ?? "dev-secret-change-me");

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  try {
    const { payload } = await jwtVerify(token, SECRET);
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
  matcher: ["/admin/:path*"],
};
