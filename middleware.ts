import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Routes accessibles à tout le monde
const isPublicRoute = createRouteMatcher([
  '/',                     // accueil public
  '/sign-in(.*)',          // connexion
  '/sign-up(.*)',          // inscription
  '/api/webhook',          // Stripe
  '/api/uploadthing(.*)',  // Upload
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// ✅ IMPORTANT : pas besoin de mettre "/" dans matcher, la regex inclut déjà tout
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
};
