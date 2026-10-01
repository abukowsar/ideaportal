import { withAuth } from "next-auth/middleware";
import { authSecret } from "@/lib/authSecret";

export default withAuth({
  secret: authSecret,
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/submit/:path*", "/dashboard/:path*", "/dpp/:path*", "/print/dpp/:path*"],
};
