import { NextFetchEvent, NextRequest } from "next/server";

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const { token = "" } = req.cookies;

  return new Response("Token:" + token);
}
