import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// import * as jose from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest | any) {
  if (req.nextUrl.pathname.startsWith("/checkout")) {
    const response = NextResponse.next();

    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // console.log({ session });

    if (!session) {
      const { pathname } = req.nextUrl;
      return NextResponse.redirect(
        new URL(`/auth/login?p=${pathname}`, req.url)
      );
    }
    return NextResponse.next();

    // Getting cookies from the request
    // const token = request.cookies.get("token");
    // let isValidToken = false;

    // try {
    //   await jose.jwtVerify(
    //     token || "",
    //     new TextEncoder().encode(process.env.JWT_SECRET_SEED)
    //   );
    //   isValidToken = true;
    //   return NextResponse.next();
    // } catch (error) {
    //   console.error(`JWT Invalid or not signed in`, { error });
    //   isValidToken = false;
    // }

    // if (!isValidToken) {
    //   const { pathname } = request.nextUrl;
    //   return NextResponse.redirect(
    //     new URL(`/auth/login?p=${pathname}`, request.url)
    //   );
    // }
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
