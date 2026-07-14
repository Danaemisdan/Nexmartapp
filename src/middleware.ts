import { clerkMiddleware } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // If the request is coming from a vendor subdomain
  if (hostname.startsWith("vendor.")) {
    // 1. Check for custom vendor session cookie
    const hasVendorSession = req.cookies.has("vendor_session");
    
    // 2. If they are not logged in and not on the login page, redirect to login
    if (!hasVendorSession && !url.pathname.startsWith("/login") && !url.pathname.startsWith("/_next") && !url.pathname.startsWith("/api")) {
      url.pathname = "/login";
      // We don't rewrite here, we actually redirect them to the login page on the vendor subdomain
      return NextResponse.redirect(url);
    }

    // 3. Rewrite traffic to the /vendor directory
    if (!url.pathname.startsWith("/vendor") && !url.pathname.startsWith("/_next") && !url.pathname.startsWith("/api")) {
      url.pathname = `/vendor${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    
    // Bypass Clerk completely for vendor subdomain
    return NextResponse.next();
  }

  return NextResponse.next();
});
export const config = {
  matcher: [
    // Skip Next.js internals, static files, and webhooks
    '/((?!_next|api/webhooks|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes, except webhooks
    '/(api/(?!webhooks)|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
