"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";
import { songs, libraries, Library, LibraryWithSongs } from "@/lib/db/schema/camelchords";
import { user as mainUser } from "@/lib/db/schema";
import { getUser } from "@/lib/auth-utils";

const getOrCreateLibrary = async (userId: string) => {
  const userLibraries = await db
    .select()
    .from(libraries)
    .where(eq(libraries.userId, userId))
    .limit(1);

  if (userLibraries.length > 0) {
    return userLibraries[0];
  }

  const [newLibrary] = await db
    .insert(libraries)
    .values({ name: "Library", userId })
    .returning();

  return newLibrary;
};

const createSongSchema = z.object({
  name: z.string(),
  content: z.string(),
  libraryId: z.number().optional(),
});

export const createSong = async (
  data: Omit<z.infer<typeof createSongSchema>, "userId">
) => {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  let { name, content, libraryId } = data;
  let createdSongId;

  try {
    if (!libraryId) {
      const library = await getOrCreateLibrary(user.id);
      libraryId = library.id;
    }

    const existingSong = await db
      .select()
      .from(songs)
      .where(and(eq(songs.name, name), eq(songs.libraryId, libraryId)))
      .limit(1);

    if (existingSong.length > 0) {
      return {
        error: "Song name already exists in this library. Please change it.",
        name,
        content,
      };
    }

    const [createdSong] = await db
      .insert(songs)
      .values({ name, content, libraryId })
      .returning();

    if (!createdSong) {
      return {
        error: "Failed to create song. Please try again.",
        name,
        content,
      };
    }
    createdSongId = createdSong.id;
    return { song: createdSong };
  } catch (error) {
    console.error("Error creating song:", error);
    return {
      error: "Failed to create song",
      name: data.name,
      content: data.content,
    };
  }
};

const updateSongSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
});

export const updateSong = async (data: z.infer<typeof updateSongSchema>) => {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const id = Number(data.id);
  const { name, content } = data;

  if (isNaN(id)) {
    return {
      error: "Invalid song ID",
      name,
      content,
    };
  }

  try {
    const { song } = await getSong(id);
    if (!song) {
      return {
        error: "Song not found.",
        name,
        content,
      };
    }

    const { library } = await getLibrary(song.libraryId);
    if (!library || library.userId !== user.id) {
      return { error: "Unauthorized" };
    }

    const existingSong = await db
      .select()
      .from(songs)
      .where(eq(songs.id, id))
      .limit(1);

    if (existingSong.length === 0) {
      return {
        error: "Song not found.",
        name,
        content,
      };
    }

    const [updatedSong] = await db
      .update(songs)
      .set({ name, content })
      .where(eq(songs.id, id))
      .returning();

    if (!updatedSong) {
      return {
        error: "Failed to update song. Please try again.",
        name,
        content,
      };
    }
    return { song: updatedSong };
  } catch (error) {
    console.error("Error updating song:", error);
    return {
      error: "Failed to update song",
      name: data.name,
      content: data.content,
    };
  }
};

export const deleteSong = async (songId: number) => {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  if (isNaN(songId)) {
    return {
      error: "Invalid song ID",
    };
  }

  try {
    const { song } = await getSong(songId);
    if (!song) {
      return { error: "Song not found." };
    }

    const { library } = await getLibrary(song.libraryId);
    if (!library || library.userId !== user.id) {
      return { error: "Unauthorized" };
    }

    await db.delete(songs).where(eq(songs.id, songId)).returning();
  } catch (error) {
    console.error("Error deleting song:", error);
    throw new Error("Failed to delete song");
  } finally {
    redirect(`/camelchords`);
  }
};

export const getSongs = async (libraryId: number) => {
  if (isNaN(libraryId)) {
    return {
      error: "Invalid library ID",
    };
  }
  const songsResult = await db.select().from(songs).where(eq(songs.libraryId, libraryId));
  return { songs: songsResult };
};

export const getSong = async (songId: number) => {
  if (isNaN(songId)) {
    return {
      error: "Invalid song ID",
    };
  }
  const [song] = await db.select().from(songs).where(eq(songs.id, songId)).limit(1);
  return { song };
};

export const getLibrary = async (libraryId: number) => {
  if (isNaN(libraryId)) {
    return {
      error: "Invalid library ID",
    };
  }
  const [library] = await db.select().from(libraries).where(eq(libraries.id, libraryId)).limit(1);
  return { library };
};

export const getLibraries = async (userId: string) => {
  const userLibraries = await db
    .select()
    .from(libraries)
    .where(eq(libraries.userId, userId));
  return { libraries: userLibraries };
};

export const getLibrariesWithSongs = async (
  userId: string
): Promise<{ libraries: LibraryWithSongs[] } | { error: string }> => {
  try {
    const userLibraries = await db
      .select()
      .from(libraries)
      .where(eq(libraries.userId, userId));

    const librariesWithSongs: LibraryWithSongs[] = await Promise.all(
      userLibraries.map(async (library) => {
        const librarySongs = await db
          .select()
          .from(songs)
          .where(eq(songs.libraryId, library.id));
        return { ...library, songs: librarySongs };
      })
    );

    return { libraries: librariesWithSongs };
  } catch (error) {
    console.error("Error fetching libraries with songs:", error);
    return { error: "Failed to fetch libraries and songs." };
  }
};

export const createLibrary = async (data: { name: string }) => {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const [newLibrary] = await db
    .insert(libraries)
    .values({ ...data, userId: user.id })
    .returning();
  revalidatePath("/camelchords");
  return { library: newLibrary };
};

export const updateLibrary = async (data: { id: number; name: string }) => {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { id, name } = data;

  const { library } = await getLibrary(id);
  if (!library || library.userId !== user.id) {
    return { error: "Unauthorized" };
  }

  const [updatedLibrary] = await db
    .update(libraries)
    .set({ name })
    .where(eq(libraries.id, id))
    .returning();
  revalidatePath("/camelchords");
  return { library: updatedLibrary };
};

export const deleteLibrary = async (libraryId: number) => {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { library } = await getLibrary(libraryId);
  if (!library || library.userId !== user.id) {
    return { error: "Unauthorized" };
  }

  await db.delete(libraries).where(eq(libraries.id, libraryId));
  revalidatePath("/camelchords");
  return { success: true };
};

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const queryAiForSong = async (prompt: string) => {
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in to use this feature." };
  }

  if (!user.permissions?.includes("AI_ACCESS")) {
    return { error: "You do not have permission to use this feature." };
  }

  if (!prompt) {
    return { error: "Prompt is required." };
  }

  try {
    console.log(prompt);
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return { songContent: response.text };
  } catch (error) {
    return { error: "Error querying AI for song." };
  }
};

export async function _formatSongContentInternal(
  rawContent: string
): Promise<{ data?: string; error?: string }> {
  if (typeof rawContent !== "string") {
    return { error: "Invalid song content format from AI." };
  }

  // Basic validation: ensure it looks somewhat like ChordPro
  // (e.g., contains brackets, doesn't have excessively long lines without chords)
  if (!rawContent.includes("[") || !rawContent.includes("]")) {
    return {
      error:
        "Generated content does not appear to be in ChordPro format (missing brackets).",
    };
  }

  const lines = rawContent.split("\n");
  const formattedLines = [];
  let parseError = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") {
      // Keep empty lines if they are intentional for spacing
      formattedLines.push("");
      continue;
    }

    // A very basic check: does the line start with something like [Chord]?
    // This is a simplified check and might need to be more robust.
    if (!trimmedLine.startsWith("[")) {
      // Attempt to prefix with a common chord if a line doesn't start with one,
      // or flag as an error. For now, let's be strict.
      // This indicates a potential formatting issue from the AI.
      console.warn(`Line does not start with a chord: "${trimmedLine}"`);
      // formattedLines.push(`[G] ${trimmedLine}`); // Example: default to [G]
      parseError = true; // Flag that there was a formatting issue.
      // continue; // Skip this line or try to fix it.
      // For now, let's pass it through but acknowledge the error.
      return {
        error: `Generated content has lines not starting with a chord: "${trimmedLine}"`,
      };
    }

    // Check for excessively long lines without any apparent chord changes
    // This is a heuristic. '100' is arbitrary.
    if (trimmedLine.length > 150 && trimmedLine.split("[").length < 2) {
      return {
        error: `Generated content contains an excessively long line without chord changes: "${trimmedLine.substring(
          0,
          50
        )}..."`,
      };
    }

    formattedLines.push(trimmedLine);
  }

  if (parseError) {
    // This specific error is now handled per line, but a general flag could be useful.
    // return { error: "Some lines in the generated content do not start with a chord." };
  }

  if (formattedLines.join("\n").length < 10) {
    // Arbitrary minimum length
    return {
      error: "Generated song content is too short or improperly formatted.",
    };
  }

  return { data: formattedLines.join("\n") };
}

// Function specifically for formatting existing text content into ChordPro using AI
export async function _formatChordProWithAI(
  rawContent: string
): Promise<{ data?: string; error?: string }> {
  // End Rate Limiting

  if (typeof rawContent !== "string" || rawContent.trim() === "") {
    return { error: "Invalid raw content provided for formatting." };
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Format the following song content into ChordPro format. Ensure that each line of lyrics has corresponding chords above it. Only return the formatted song content, with no other conversational text. Here is the content: ${rawContent}`,
            },
          ],
        },
      ],
    });
    return { data: response.text };
  } catch (error) {
    console.error("AI formatting error:", error);
    return { error: "Failed to format song content with AI." };
  }
}

// Renaming the old function
export async function _validateAndCleanSongContentInternal(
  rawContent: string
): Promise<{ data?: string; error?: string }> {
  if (typeof rawContent !== "string") {
    return { error: "Invalid song content format from AI." };
  }

  // Basic validation: ensure it looks somewhat like ChordPro
  // (e.g., contains brackets, doesn't have excessively long lines without chords)
  if (!rawContent.includes("[") || !rawContent.includes("]")) {
    return {
      error:
        "Generated content does not appear to be in ChordPro format (missing brackets).",
    };
  }

  const lines = rawContent.split("\n");
  const formattedLines = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") {
      // Keep empty lines if they are intentional for spacing
      formattedLines.push("");
      continue;
    }

    if (!trimmedLine.startsWith("[")) {
      console.warn(`Line does not start with a chord: "${trimmedLine}"`);
      return {
        error: `Generated content has lines not starting with a chord: "${trimmedLine}"`,
      };
    }

    if (trimmedLine.length > 150 && trimmedLine.split("[").length < 2) {
      return {
        error: `Generated content contains an excessively long line without chord changes: "${trimmedLine.substring(
          0,
          50
        )}..."`,
      };
    }

    formattedLines.push(trimmedLine);
  }

  if (formattedLines.join("\n").length < 10) {
    // Arbitrary minimum length
    return {
      error: "Generated song content is too short or improperly formatted.",
    };
  }

  return { data: formattedLines.join("\n") };
}
