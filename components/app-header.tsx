"use client";

import { Moon, Sun, Folder, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Share_Tech } from "next/font/google";
import { Command, CommandInput } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "./ui/separator";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const shareTech = Share_Tech({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
});

type SearchResults = {
  projects: { slug: string; title: string; id: number }[];
  tasks: { id: number; title: string; projectSlug: string }[];
};

function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    tasks: [],
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], tasks: [] });
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data: SearchResults = await res.json();
      setResults(data);
      setOpen(data.projects.length > 0 || data.tasks.length > 0);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = results.projects.length > 0 || results.tasks.length > 0;

  return (
    <div className="relative h-10 w-full max-w-sm">
      <Command shouldFilter={false} className="h-10 rounded-lg border">
        <CommandInput
          placeholder="Search..."
          value={query}
          onValueChange={setQuery}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => hasResults && setOpen(true)}
        />
      </Command>
      {open && hasResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md">
          {results.projects.length > 0 && (
            <div className="p-1">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Projects
              </p>
              {results.projects.map((p) => (
                <button
                  key={p.id}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                  onMouseDown={() => {
                    router.push(`/projects/${p.id}`);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <Folder className="size-4 shrink-0 text-muted-foreground" />
                  {p.title}
                </button>
              ))}
            </div>
          )}
          {results.projects.length > 0 && results.tasks.length > 0 && (
            <div className="mx-1 h-px bg-border/50" />
          )}
          {results.tasks.length > 0 && (
            <div className="p-1">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Tickets
              </p>
              {results.tasks.map((t) => (
                <button
                  key={t.id}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                  onMouseDown={() => {
                    router.push(`/projects/${t.projectSlug}`);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <CircleDot className="size-4 shrink-0 text-muted-foreground" />
                  {t.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function ProfileAvatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="/dcrep.webp" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Damian Rene</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Projects</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Log Out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const AppHeader = () => {
  return (
    <header className="h-15 shrink-0 border-b bg-background text-foreground">
      <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            loading="eager"
            alt="Logo"
            width={35}
            height={35}
          />
          <p className={`text-2xl ${shareTech.className}`}>tickflow</p>
        </div>
        <div className="flex justify-center">
          <SearchBar />
        </div>
        <div className="flex gap-2">
          <ModeToggle />
          <Separator orientation="vertical" />
          <ProfileAvatar />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
