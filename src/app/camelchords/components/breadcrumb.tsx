"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { LibraryContext } from "@/app/camelchords/hooks/useLibrary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Song, LibraryWithSongs } from "@/lib/db/schema/camelchords";
import Link from "next/link";

export function CamelchordsBreadcrumb() {
  const pathname = usePathname();
  const { libraries } = React.useContext(LibraryContext);

  const pathParts = pathname.split("/").filter(Boolean);

  if (pathParts[0] !== 'camelchords') {
    return null;
  }

  // Handle /camelchords/create-song
  if (pathParts[1] === 'create-song') {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Create Song</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  let library: LibraryWithSongs | undefined;
  let song: Song | undefined;

  if (pathParts[1] === "songs" && pathParts[2]) {
    const songId = parseInt(pathParts[2], 10);
    if (!isNaN(songId)) {
      for (const lib of libraries) {
        const foundSong = lib.songs.find((s) => s.id === songId);
        if (foundSong) {
          song = foundSong;
          library = lib;
          break;
        }
      }
    }
  } else if (pathParts[1] === "libraries" && pathParts[2]) {
    const libraryId = parseInt(pathParts[2], 10);
    if (!isNaN(libraryId)) {
      library = libraries.find((lib) => lib.id === libraryId);
    }
  }

  if (!library) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {song ? (
            <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                <Link href={`/camelchords/libraries/${library.id}`}>
                    {library.name}
                </Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
        ) : (
            <BreadcrumbItem>
                <BreadcrumbPage>{library.name}</BreadcrumbPage>
            </BreadcrumbItem>
        )}
        
        {song && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{song.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 