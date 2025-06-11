import { NextRequest, NextResponse } from "next/server";
import {
  updateLibrary,
  deleteLibrary,
  getLibrary,
} from "@/app/camelchords/utils/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function checkOwnership(libraryId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) return false;

  const { library } = await getLibrary(libraryId);
  if (!library) return false;

  return library.userId === session.user.id;
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const isOwner = await checkOwnership(Number(params.id));
  if (!isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = await updateLibrary({ id: Number(params.id), ...body });

  if (!result) {
    return NextResponse.json({ error: "Error updating library" }, { status: 400 });
  }

  return NextResponse.json(result.library);
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const isOwner = await checkOwnership(Number(params.id));
  if (!isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await deleteLibrary(Number(params.id));

  if (!result.success) {
    return NextResponse.json({ error: "Error deleting library" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
} 