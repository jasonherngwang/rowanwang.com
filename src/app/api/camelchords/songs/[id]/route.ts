import { NextRequest, NextResponse } from "next/server";
import {
  updateSong,
  deleteSong,
  getSong,
  getLibrary,
} from "@/app/camelchords/utils/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function checkOwnership(songId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return false;

  const { song } = await getSong(songId);
  if (!song) return false;

  const { library } = await getLibrary(song.libraryId);
  if (!library) return false;

  return library.userId === session.user.id;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isOwner = await checkOwnership(Number(params.id));
  if (!isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = await updateSong({ id: params.id, ...body });

  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isOwner = await checkOwnership(Number(params.id));
  if (!isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await deleteSong(Number(params.id));

  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
} 