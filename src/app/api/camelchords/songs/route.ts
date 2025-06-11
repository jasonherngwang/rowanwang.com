import { NextRequest, NextResponse } from "next/server";
import { getSongs, createSong } from "@/app/camelchords/utils/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const libraryId = searchParams.get("libraryId");

  if (!libraryId) {
    return NextResponse.json(
      { error: "libraryId is required" },
      { status: 400 }
    );
  }

  const songsResult = await getSongs(Number(libraryId));

  if (songsResult.error) {
    return NextResponse.json({ error: songsResult.error }, { status: 400 });
  }

  return NextResponse.json(songsResult.songs);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = await createSong({ ...body, userId: session.user.id });

  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
} 