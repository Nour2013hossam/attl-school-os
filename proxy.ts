import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge-safe auth instance for middleware only.
// It uses the lightweight authConfig (no Prisma adapter or bcrypt/Credentials
// provider), so it can run in the Edge runtime. The full auth instance with
// Prisma lives in "@/auth" and is used only in the Node.js runtime.
const { auth } = NextAuth(authConfig);

export { auth as proxy };

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.ico$).*)"],
};
