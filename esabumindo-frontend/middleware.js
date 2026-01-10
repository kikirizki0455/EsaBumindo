import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

export default function middleware(req) {
  const token = req.cookies.get("access_token")?.value;
  const pathname = req.nextUrl.pathname;

  //proteksi admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}
