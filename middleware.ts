import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import * as jose from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/checkout")) {
    const response = NextResponse.next();

    // Getting cookies from the request
    const token = request.cookies.get("token");
    let isValidToken = false;

    try {
      await jose.jwtVerify(
        token || "",
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      isValidToken = true;
      return NextResponse.next();
    } catch (error) {
      console.error(`JWT Invalid or not signed in`, { error });
      isValidToken = false;
    }

    if (!isValidToken) {
      const { pathname } = request.nextUrl;
      return NextResponse.redirect(
        new URL(`/auth/login?p=${pathname}`, request.url)
      );
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/checkout/:path*"],
};

// import { NextRequest, NextResponse } from "next/server";
// import { jwt } from "./utils";

// export async function middleware(req: NextRequest | any) {
//   const token = req.cookies.get("token");
//   console.log(token);
//   //return new NextResponse("Token:" + token);

//   try {
//     await jwt.isValidToken(token);
//     return NextResponse.next();
//   } catch (error) {
//     const requestedPage = req.page.name;
//     return NextResponse.redirect(`/auth/login?p=${requestedPage}`);
//     // console.log(req.page);
//   }
// }

// export const config = {
//   matcher: "/checkout/:path*",
// };
