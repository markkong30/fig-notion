import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);
const isPrivateRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/redirect',
  '/create-workspace',
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  if (!isPublicRoute(req)) {
    if (!userId) {
      return NextResponse.rewrite(new URL('/', req.url));
    }
  }

  // if there is user and home route is accessed, redirect to dashboard or any other protected route
  // if (userId && isPublicRoute(req)) {
  //   return NextResponse.rewrite(new URL('/dashboard', req.url));
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
