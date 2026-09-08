import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const rutaLibre =
    req.nextUrl.pathname === "/api/admin/login" || req.nextUrl.pathname === "/api/admin/logout";
  if (rutaLibre) return NextResponse.next();

  const cookie = req.cookies.get("admin_session")?.value;
  const autorizado = cookie && cookie === process.env.ADMIN_SESSION_SECRET;

  if (!autorizado) {
    if (req.nextUrl.pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/panel/:path*", "/api/admin/:path*"],
};
