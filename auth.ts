import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import { credentialsSchema } from "@/lib/validation";
import { authConfig } from "@/auth.config";
import { rateLimit } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const rate = rateLimit("login:"+parsed.data.email.toLowerCase(), 10, 15 * 60 * 1000);
        if (!rate.allowed) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!user?.passwordHash || !user.isActive) {
          return null;
        }

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatarUrl ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.picture = user.image ?? null;
        token.isActive = true;
      }

      if (token.sub) {
        const currentUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, isActive: true, avatarUrl: true },
        });

        token.isActive = Boolean(currentUser?.isActive);
        if (currentUser) {
          token.role = currentUser.role;
          token.picture = currentUser.avatarUrl ?? token.picture ?? null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.isActive === false ? "" : (token.sub ?? "");
        session.user.role = (token.role as UserRole | undefined) ?? "STUDENT";
        session.user.image = token.picture ?? null;

        if (token.sub) {
          const currentUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { name: true, email: true, role: true, avatarUrl: true, isActive: true },
          });

          if (!currentUser || !currentUser.isActive) {
            session.user.id = "";
            session.user.role = "STUDENT";
            session.user.name = "";
            session.user.email = "";
            session.user.image = null;
            return session;
          }

          session.user.name = currentUser.name;
          session.user.email = currentUser.email;
          session.user.role = currentUser.role;
          session.user.image = currentUser.avatarUrl ?? null;
        }
      }
      return session;
    },
  },
});
