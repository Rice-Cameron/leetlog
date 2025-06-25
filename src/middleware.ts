import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/problems(.*)",
  "/new(.*)",
  "/api/problems(.*)",
]);

const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "1";

export default clerkMiddleware(async (auth, req) => {
  // Maintenance mode logic
  const { pathname } = req.nextUrl;
  if (
    MAINTENANCE_MODE &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/static") &&
    pathname !== "/maintenance.html" &&
    !pathname.match(
      /\.(?:css|js|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$/
    )
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance.html";
    return NextResponse.rewrite(url);
  }

  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
