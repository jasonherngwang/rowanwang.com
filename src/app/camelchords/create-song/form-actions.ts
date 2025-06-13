"use server";

import { createSong, updateSong } from "@/app/camelchords/utils/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ActionState } from "@/app/camelchords/types";

export async function createSongAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const content = formData.get("content") as string;
  const libraryId = formData.get("libraryId") as string;

  const result = await createSong({
    name,
    content,
    libraryId: libraryId ? Number(libraryId) : undefined,
  });

  if (result?.error) {
    return {
      error: result.error,
      name,
      content,
    };
  }

  if (result?.song) {
    redirect(`/camelchords/songs/${result.song.id}`);
  }

  return { name: "", content: "" };
}

export async function updateSongAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const content = formData.get("content") as string;

  const result = await updateSong({
    id,
    name,
    content,
  });

  if (result?.error) {
    return {
      error: result.error,
      name,
      content,
    };
  }

  if (result?.song) {
    redirect(`/camelchords/songs/${result.song.id}`);
  }

  return { name, content };
} 