import { withAuth } from "next-auth/middleware";

export default withAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function middleware(_request) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect specific routes
export const config = {
  matcher: [
    // Add routes that require authentication
    // "/dashboard/:path*",
    // "/profile/:path*",
  ],
};
