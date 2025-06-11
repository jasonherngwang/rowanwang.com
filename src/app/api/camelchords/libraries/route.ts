import { NextRequest, NextResponse } from "next/server";
import {
  getLibraries,
  createLibrary,
} from "@/app/camelchords/utils/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const librariesResult = await getLibraries(session.user.id);

  if (!librariesResult) {
    return NextResponse.json({ error: "Error fetching libraries" }, { status: 400 });
  }

  return NextResponse.json(librariesResult.libraries);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = await createLibrary({ ...body, userId: session.user.id });

  if (!result) {
    return NextResponse.json({ error: "Error creating library" }, { status: 400 });
  }

  return NextResponse.json(result.library);
} 