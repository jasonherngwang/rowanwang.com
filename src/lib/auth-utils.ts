import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Session } from "better-auth";

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session as Session | null;
}

export const getUser = async () => {
    const session = await getSession();
    return session?.user;
}