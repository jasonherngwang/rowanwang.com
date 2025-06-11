import { betterAuth, type BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { env } from "@/env";
import { customSession } from "better-auth/plugins";
import { user as userTable, type User } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const options = {
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
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(
      async ({ session, user }) => {
        if (!session?.userId) {
          return { session, user: undefined };
        }

        const [dbUser] = (await db
          .select()
          .from(userTable)
          .where(eq(userTable.id, session.userId))) as (User | undefined)[];

        return {
          user: dbUser,
          session,
        };
      },
      options
    ),
  ],
});
