"use server";

import { db } from "@/lib/db";
import { user as userTable, Permission } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserPermission(userId: string, permission: Permission, hasPermission: boolean) {
  const targetUser = await db.query.user.findFirst({
    where: eq(userTable.id, userId),
  });

  if (!targetUser) {
    throw new Error("User not found");
  }

  let newPermissions = targetUser.permissions || [];

  if (hasPermission) {
    if (!newPermissions.includes(permission)) {
      newPermissions.push(permission);
    }
  } else {
    newPermissions = newPermissions.filter(p => p !== permission);
  }

  await db.update(userTable).set({ permissions: newPermissions }).where(eq(userTable.id, userId));

  revalidatePath("/dashboard/admin");
}

export async function getUsers() {
    const users = await db.query.user.findMany();
    return users;
} 