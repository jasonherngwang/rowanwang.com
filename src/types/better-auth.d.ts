import "better-auth";
import type { DefaultSession } from "better-auth";
import { User } from "@/lib/db/schema";

declare module "better-auth" {
  interface Session {
    user: User;
  }
} 