"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LibraryContext } from "../hooks/useLibrary";
import {
  createLibrary,
  updateLibrary,
  deleteLibrary,
} from "@/app/camelchords/utils/actions";
import { type User } from "@/lib/db/schema";

import {
  ChevronRight,
  Library,
  PlusIcon,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ user }: { user: User | null | undefined }) {
  const { libraries } = React.useContext(LibraryContext);
  const router = useRouter();

  const handleCreateLibrary = async () => {
    if (!user) return;
    const name = prompt("Enter new library name:");
    if (name) {
      await createLibrary({ name, userId: user.id });
    }
  };

  const handleRenameLibrary = async (id: number) => {
    const name = prompt("Enter new library name:");
    if (name) {
      await updateLibrary({ id, name });
    }
  };

  const handleDeleteLibrary = async (id: number) => {
    if (confirm("Are you sure you want to delete this library?")) {
      await deleteLibrary(id);
    }
  };

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Libraries</SidebarGroupLabel>
        <button onClick={handleCreateLibrary} className="pr-4">
          <PlusIcon size={16} />
        </button>
      </div>
      <SidebarMenu>
        {libraries?.map((library) => (
          <Collapsible key={library.id} asChild defaultOpen={true}>
            <SidebarMenuItem className="group">
              <SidebarMenuButton asChild tooltip={library.name}>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Library />
                    <span>{library.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Pencil size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={8} align="start">
                      <DropdownMenuItem
                        onClick={() => handleRenameLibrary(library.id)}
                      >
                        <Pencil size={14} className="mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteLibrary(library.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SidebarMenuButton>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="ml-auto data-[state=open]:rotate-90">
                  <ChevronRight />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {library.songs?.map((song) => (
                    <SidebarMenuSubItem key={song.id}>
                      <SidebarMenuSubButton asChild>
                        <a href={`/camelchords/songs/${song.id}`}>
                          <span>{song.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a
                        href={`/camelchords/create-song?libraryId=${library.id}`}
                      >
                        <PlusIcon className="stroke-primary" />
                        <span>Create song</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
