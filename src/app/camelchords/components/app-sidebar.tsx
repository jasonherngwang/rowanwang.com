"use client";

import * as React from "react";
import Link from "next/link";
import { Guitar, Home } from "lucide-react";

import { NavMain } from "@/app/camelchords/components/nav-main";
import { NavUser } from "@/app/camelchords/components/nav-user";
import ThemeToggler from "@/components/theme/toggler";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type User } from "@/lib/db/schema";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User | null | undefined }) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/camelchords">
                <div className="bg-sidebar-primary dark:bg-pine text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Guitar className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CamelChords</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home className="mr-1 size-4" />
                rowanwang.com
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain user={user} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="flex-col gap- ">
          <SidebarMenuItem>
              <ThemeToggler className="cursor-pointer" />
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <NavUser user={user} />
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
