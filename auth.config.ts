import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      const isDashboard = pathname.startsWith("/dashboard");
      const isApi = pathname.startsWith("/api");
      const isAuthPage = pathname === "/login" || pathname === "/register";

      if (isApi) return true;
      if (isDashboard) return !!auth?.user;
      if (auth?.user && isAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
