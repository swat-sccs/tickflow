"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
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

const shareTech = Share_Tech({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
});

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
    <header className="h-14 shrink-0 border-b bg-background text-foreground">
      <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo error" width={35} height={35} />
          <p className={`text-2xl ${shareTech.className}`}>tickflow</p>
        </div>
        <div className="flex justify-center">
          <Command className="h-10 w-full max-w-sm rounded-lg border">
            <CommandInput placeholder="Search..." />
          </Command>
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
