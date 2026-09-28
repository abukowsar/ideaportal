import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/submit/:path*", "/dashboard/:path*", "/dpp/:path*", "/print/dpp/:path*"],
};
