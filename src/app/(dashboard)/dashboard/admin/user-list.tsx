"use client";

import { useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateUserPermission } from "../actions";
import type { user } from "@/lib/db/schema";

interface UserListProps {
  users: (typeof user.$inferSelect)[];
}

export function UserList({ users }: UserListProps) {

  return (
    <div className="space-y-4">
      {users.map((u) => (
        <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <form action={async (formData) => {
                const hasPermission = formData.get("hasAiAccess") === "on";
                await updateUserPermission(u.id, "AI_ACCESS", hasPermission);
            }}>
              <Checkbox
                key={`${u.id}-${u.permissions?.join(",")}`}
                id={`ai-access-${u.id}`}
                name="hasAiAccess"
                defaultChecked={u.permissions?.includes("AI_ACCESS")}
                className="mr-2"
              />
              <Label htmlFor={`ai-access-${u.id}`} className="mr-4">
                AI Access
              </Label>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Save
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
} 