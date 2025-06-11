import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { env } from "@/env";
import { type User } from "@/lib/db/schema";

type Session = { user?: Partial<User> };

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [nextCookies()],
  callbacks: {
    session({ session, user }: { session: Session; user: User }) {
      if (session.user && user.permissions) {
        session.user.permissions = user.permissions;
      }
      return session;
    },
  },
});
