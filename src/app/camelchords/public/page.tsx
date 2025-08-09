import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { parseSongContent, type ContentBlock } from "@/app/camelchords/utils/parser";
import { UkuleleChordDiagram } from "@/app/camelchords/songs/[id]/chord-diagram";

const demoSongs = [
  {
    id: 1000001,
    name: "Twinkle Twinkle (Demo)",
    content: `
(Verse 1)
[C]Twinkle twinkle [F]little star
[Em7]How I wonder [D]where you are

(Chorus)
[C]Up above the [F]world so high
[Em7]Like a diamond [D]in the sky
`,
  },
  {
    id: 1000002,
    name: "You Are My Sunshine (Demo)",
    content: `
(Verse)
[C]You are my [F]sunshine, my only [C]sunshine
[C]You make me [F]happy when skies are [C]gray
[C]You'll never [F]know dear, how much I [C]love you
[C]Please don't take my [G7]sunshine [C]away
`,
  },
];

function DemoSong({ name, content }: { name: string; content: string }) {
  const parsedSong = parseSongContent(content);
  if (!parsedSong) return null;

  const uniqueChords: string[] = Array.from(
    new Set(
      parsedSong.flatMap((line) =>
        line.filter((b) => b.type === "chord").map((b) => b.content)
      )
    )
  );

  return (
    <div className="rounded-md border p-4">
      <div className="text-xl font-semibold mb-4">{name}</div>
      <div className="flex gap-12">
        <div className="font-mono text-sm space-y-3">
          {parsedSong.map((line, lineIndex) => (
            <div key={lineIndex} className="flex whitespace-nowrap overflow-x-auto">
              {line.map((block, blockIndex) => {
                if (block.type === "annotation") {
                  return (
                    <div key={blockIndex} className="flex text-foreground whitespace-nowrap font-bold mt-6">
                      {block.content}
                    </div>
                  );
                }
                if (block.type === "lyric" && blockIndex === 0) {
                  return (
                    <div key={blockIndex} className="flex flex-col items-start mr-4">
                      <span className="text-muted-foreground whitespace-nowrap">&nbsp;</span>
                      <span className="whitespace-nowrap">{block.content}</span>
                    </div>
                  );
                }
                if (block.type === "chord") {
                  const nextBlock: ContentBlock | undefined = line[blockIndex + 1];
                  const lyric = nextBlock?.type === "lyric" ? nextBlock.content : " ";
                  return (
                    <div key={blockIndex} className="flex flex-col items-start mr-4">
                      <span className="text-muted-foreground whitespace-nowrap">{block.content}</span>
                      <span className="whitespace-nowrap">{lyric}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
        <div className="flex-1 flex-shrink-0 space-y-4">
          {uniqueChords.map((chord) => (
            <UkuleleChordDiagram key={chord} chord={chord} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function CamelChordsPublicDemoPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="mx-auto max-w-4xl py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CamelChords Demo</h1>
          <p className="text-muted-foreground mt-1">
            Explore a couple of example songs in read‑only mode. Sign in to create your own
            libraries, generate songs with AI, and edit content.
          </p>
        </div>
        {session?.user ? (
          <Link href="/camelchords">
            <Button className="cursor-pointer">Go to your library</Button>
          </Link>
        ) : (
          <Link href="/sign-in?redirectUrl=/camelchords">
            <Button className="cursor-pointer">Sign in to get started</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6">
        {demoSongs.map((song) => (
          <DemoSong key={song.id} name={song.name} content={song.content} />
        ))}
      </div>

      {!session?.user && (
        <div className="text-center pt-6">
          <Link href="/sign-in?redirectUrl=/camelchords">
            <Button variant="outline" className="cursor-pointer">Sign in</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
