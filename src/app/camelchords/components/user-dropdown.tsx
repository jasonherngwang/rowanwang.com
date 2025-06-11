"use client";

import * as React from "react";
import { ChevronDown, Guitar, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "@/lib/auth-client";

export function UserDropdown({
  options,
}: {
  options?: { title: string; url: string; isSignOut?: boolean }[];
}) {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted/50" />
            <div className="flex flex-col gap-1.5 leading-none">
              <span className="h-4 w-20 rounded-sm bg-muted/50" />
              <span className="h-3 w-28 rounded-sm bg-muted/50" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!session) {
    // Or a sign-in button
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Guitar className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{session.user.name || "Camel"}</span>
                <span className="">{session.user.email || ""}</span>
              </div>
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {options?.map((option) => {
              if (option.isSignOut) {
                return null;
              }
              return (
                <DropdownMenuItem key={option.title} asChild>
                  <a href={option.url} className="w-full">{option.title}</a>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="stroke-primary" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
} 