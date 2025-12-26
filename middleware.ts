import axios from "axios";
import { parse } from "cookie";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const privateRoutes = ["/profile"];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPrivateRoute) {
    if (!accessToken) {
      if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
      } else {
        const response = await axios.get(
          "https://next-v1-notes-api.goit.study/auth/session",
          {
            headers: {
              Cookie: cookieStore.toString(),
            },
          }
        );

        const setCookie = response.headers["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookie of cookieArray) {
            const parsed = parse(cookie);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed["Max-Age"]),
            };

            if (parsed.accessToken) {
              cookieStore.set("accessToken", parsed.accessToken, options);
            }

            if (parsed.refreshToken) {
              cookieStore.set("refreshToken", parsed.refreshToken, options);
            }
          }
        }

        return NextResponse.next({
          headers: {
            Cookie: cookieStore.toString(),
          },
        });
      }
    } else {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matchers: ["/profile"],
};
