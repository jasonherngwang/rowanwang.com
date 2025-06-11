"use client";

import { createContext, ReactNode } from "react";
import { LibraryWithSongs } from "@/lib/db/schema/camelchords";

type LibraryContextType = {
  libraries: LibraryWithSongs[];
};

export const LibraryContext = createContext<LibraryContextType>({
  libraries: [],
});

interface LibraryProviderProps {
  children: ReactNode;
  libraries?: LibraryWithSongs[];
}

export function LibraryProvider({
  children,
  libraries = [],
}: LibraryProviderProps) {
  return (
    <LibraryContext.Provider value={{ libraries }}>
      {children}
    </LibraryContext.Provider>
  );
}
