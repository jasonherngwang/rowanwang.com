import { getUser } from "@/lib/auth-utils";
import { getUsers } from "../actions";
import { UserList } from "./user-list";
import { env } from "@/env";

export default async function AdminPage() {
  const user = await getUser();

  if (user?.email !== env.SUPERUSER_EMAIL) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const users = await getUsers();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Admin - User Permissions</h1>
      <UserList users={users} />
    </div>
  );
} 