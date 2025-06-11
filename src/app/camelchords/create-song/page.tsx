import { getSong } from "@/app/camelchords/utils/actions";
import CreateSongForm from "./create-song-form";

export default async function CreateSongPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const songId = searchParams?.songId;
  let song = null;

  if (typeof songId === "string") {
    const { song: fetchedSong } = await getSong(parseInt(songId, 10));
    song = fetchedSong;
  }

  const mode = songId ? "update" : "create";

  return <CreateSongForm mode={mode} song={song ?? undefined} />;
} 