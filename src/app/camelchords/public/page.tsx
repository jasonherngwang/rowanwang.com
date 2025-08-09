import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  parseSongContent,
  type ContentBlock,
} from "@/app/camelchords/utils/parser";
import { UkuleleChordDiagram } from "@/app/camelchords/songs/[id]/chord-diagram";

const demoSongs = [
  {
    id: 1000001,
    name: "Mad 4 Milk 🍼",
    content: `
(Verse 1)
[C]Hi, my name is Rolly
and [F]I’m so mad!
[Em7]Cuz I’m very hungry
and it [D]makes me SAD.

(Verse 2)
[C]You better get my milk here
[F]right away!
If you don’t, [Em7]I guarantee
[D]I’ll make you pay 🔪
`,
  },
  {
    id: 1000002,
    name: "HUUNGRY HIPPO 🦛",
    content: `
(Verse 1)
[C]I'm a little hippo, [G]short and round,
[C]Eating all day, [G]on the ground.
[C]Watermelons, [G]grapes and more,
[C]I eat and eat, [G]and then I snore.

(Verse 2)
[C]My tummy's full, [G]I can't stand up,
[C]I'm waddling slow, [G]in a big slump.
[C]I've eaten so much, [G]it's quite a sight,
[C]I'm tumbling down, [G]into the night.


(Verse 3)
[C]I'm stuck in the mud, [G]oh dear, oh dear,
[C]All this food, [G]it brought me here.
[C]My mom will laugh, [G]when she sees me,
[C]But I'll learn my lesson, [G]you'll agree.

(Verse 4)
[C]So let this be, [G]a warning to all,
[C]Don't eat too much, [G]or you might fall!
[C]Hippos, like me, [G]should eat just right,
[C]Then we can play, [G]all day and night.
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
            <div
              key={lineIndex}
              className="flex whitespace-nowrap overflow-x-auto"
            >
              {line.map((block, blockIndex) => {
                if (block.type === "annotation") {
                  return (
                    <div
                      key={blockIndex}
                      className="flex text-foreground whitespace-nowrap font-bold mt-6"
                    >
                      {block.content}
                    </div>
                  );
                }
                if (block.type === "lyric" && blockIndex === 0) {
                  return (
                    <div
                      key={blockIndex}
                      className="flex flex-col items-start mr-4"
                    >
                      <span className="text-muted-foreground whitespace-nowrap">
                        &nbsp;
                      </span>
                      <span className="whitespace-nowrap">{block.content}</span>
                    </div>
                  );
                }
                if (block.type === "chord") {
                  const nextBlock: ContentBlock | undefined =
                    line[blockIndex + 1];
                  const lyric =
                    nextBlock?.type === "lyric" ? nextBlock.content : " ";
                  return (
                    <div
                      key={blockIndex}
                      className="flex flex-col items-start mr-4"
                    >
                      <span className="text-muted-foreground whitespace-nowrap">
                        {block.content}
                      </span>
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
            Explore a couple of example songs in read‑only mode. Sign in to
            create your own libraries, generate songs with AI, and edit content.
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
            <Button variant="outline" className="cursor-pointer">
              Sign in
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
