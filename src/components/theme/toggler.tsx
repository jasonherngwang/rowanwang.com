"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeTogglerProps = {
  className?: string;
  showText?: boolean;
};

export default function ThemeToggler({
  className,
  showText,
}: ThemeTogglerProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const switchTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const toggleTheme = () => {
    //@ts-ignore
    if (!document.startViewTransition) switchTheme();

    //@ts-ignore
    document.startViewTransition(switchTheme);
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className={cn(`${showText ? "w-full justify-start" : "'"}`, className)}
    >
      <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {showText && <span className="ml-2">Toggle theme</span>}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
