import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  api: 30,
  ai: 5,
  aiSandbox: 10,
  windowMs: 60_000,
};

function getRateLimit(ip: string, route: string) {
  const key = `${ip}:${route}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return { allowed: true, remaining: RATE_LIMIT.api };
  }

  entry.count++;
  let limit = RATE_LIMIT.api;
  if (route.startsWith("api/training/sandbox") || route.startsWith("api/training/tutor")) {
    limit = RATE_LIMIT.aiSandbox;
  } else if (route.startsWith("api/ai")) {
    limit = RATE_LIMIT.ai;
  }
  return { allowed: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
}

const PUBLIC_PATHS = ["/", "/login", "/dashboard", "/about", "/document", "/_next", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith("/_next"))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const route = pathname.replace("/api/", "api/");
    const { allowed, remaining } = getRateLimit(ip, route);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" } }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
