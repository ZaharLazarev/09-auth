import { NextRequest, NextResponse } from "next/server";

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const AUTH_PAGES = ["/sign-in", "/sign-up"];

function isPathStartsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = isPathStartsWithAny(pathname, PRIVATE_PREFIXES);
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  if (!accessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    try {
      const cookieHeader = request.headers.get("cookie") ?? "";

      const apiRes = await fetch(
        "https://next-v1-notes-api.goit.study/auth/session",
        {
          method: "GET",
          headers: {
            cookie: cookieHeader,
          },
        }
      );

      if (!apiRes.ok) {
        const res = NextResponse.redirect(new URL("/sign-in", request.url));
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
      }

      const setCookie = apiRes.headers.get("set-cookie");

      const res = NextResponse.next();

      if (setCookie) {
        res.headers.append("set-cookie", setCookie);
      }

      return res;
    } catch {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
