import "better-auth";
import type { DefaultSession } from "better-auth";
import { Permission } from "@/lib/db/schema";

declare module "better-auth" {
  interface User {
    permissions?: Permission[];
  }
  interface Session {
    user: {
      permissions?: Permission[];
    } & DefaultSession["user"];
  }
} 