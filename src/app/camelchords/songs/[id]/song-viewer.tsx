"use client";

import * as React from "react";
import { parseSongContent, ContentBlock } from "@/app/camelchords/utils/parser";
import CreateSongForm from "@/app/camelchords/create-song/create-song-form";
import { Song } from "@/lib/db/schema/camelchords";
import { Button } from "@/components/ui/button";
import { UkuleleChordDiagram } from "./chord-diagram";

interface SongEditorProps {
  song: Song;
}

export const SongViewer = ({ song }: SongEditorProps) => {
  const parsedSong = parseSongContent(song?.content);

  const [isEditing, setIsEditing] = React.useState(false);

  if (!song || !parsedSong) {
    return null;
  }

  return (
    <div>
      <div>
        {isEditing ? (
          <div className="flex flex-col gap-6">
            <CreateSongForm mode="update" song={song} />
            <Button
              onClick={() => setIsEditing(false)}
              className="w-36 cursor-pointer"
              variant="outline"
            >
              Cancel edit
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="text-3xl">{song.name}</div>
            <div>
              <SongReadOnly parsedSong={parsedSong} />
              <Button
                onClick={() => setIsEditing(true)}
                className="mt-8 w-36 cursor-pointer"
              >
                Edit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DisplaySongProps {
  parsedSong: ContentBlock[][];
}

const SongReadOnly = ({ parsedSong }: DisplaySongProps) => {
  const uniqueChords = React.useMemo(() => {
    const chords = new Set<string>();
    parsedSong.forEach((line) => {
      line.forEach((block) => {
        if (block.type === "chord") {
          chords.add(block.content);
        }
      });
    });
    return Array.from(chords);
  }, [parsedSong]);

  return (
    <div className="flex gap-16">
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
                // Find the next lyric block to pair with this chord
                const nextBlock = line[blockIndex + 1];
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
  );
};
