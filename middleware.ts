import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = 1; // max requests
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
let requests = 0;
let resetTime = Date.now() + RATE_LIMIT_WINDOW;

function rateLimit(request: NextRequest): boolean {
  const now = Date.now();

  if (now > resetTime) {
    requests = 1;
    resetTime = now + RATE_LIMIT_WINDOW;
    return false;
  } else {
    if (requests < RATE_LIMIT) {
      requests += 1;
      return false;
    } else {
      return true;
    }
  }
}

export function middleware(request: NextRequest): NextResponse | Response {
  if (rateLimit(request)) {
    return new Response("Rate limit exceeded.", {
      status: 429,
    });
  }

  return NextResponse.next();
}

export const config = {
  //matcher: ["/api/:path*"],
  matcher: "/",
};
