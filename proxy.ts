import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((request) => {
  const loggedIn = Boolean(request.auth)
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  if (!loggedIn && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  if (loggedIn && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
