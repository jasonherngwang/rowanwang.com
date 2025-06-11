import { AppSidebar } from "@/app/camelchords/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LibraryProvider } from "@/app/camelchords/hooks/useLibrary";
import { getLibrariesWithSongs } from "@/app/camelchords/utils/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LibraryWithSongs } from "@/lib/db/schema/camelchords";
import { CamelchordsBreadcrumb } from "@/app/camelchords/components/breadcrumb";

async function getInitialLibraries(
  userId: string | undefined
): Promise<LibraryWithSongs[] | undefined> {
  if (!userId) return undefined;

  const librariesResult = await getLibrariesWithSongs(userId);

  if ("error" in librariesResult) {
    console.error(librariesResult.error);
    return undefined;
  }

  return librariesResult.libraries;
}

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const initialLibraries = await getInitialLibraries(session?.user?.id);
  return (
    <LibraryProvider libraries={initialLibraries}>
      <SidebarProvider>
        <AppSidebar user={session?.user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <CamelchordsBreadcrumb />
            </div>
          </header>
          <div className="px-8 pb-8 md:px-16 md:pb-16">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </LibraryProvider>
  );
}
