"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/actions/actions";
import { UserMultiSelect } from "@/components/user-multi-select";
import { PROJECT_ICONS, type ProjectIconName } from "@/lib/project-icons";

type User = { id: number; name: string; email: string };

const iconNames = Object.keys(PROJECT_ICONS) as ProjectIconName[];

export function NewProjectDialog({
  children,
  users,
}: {
  children: React.ReactNode;
  users: User[];
}) {
  const [selectedIcon, setSelectedIcon] = useState<ProjectIconName>("Globe");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" action={createProject}>
          <input type="hidden" name="icon" value={selectedIcon} />

          <div className="flex flex-col gap-1.5">
            <Label>Icon</Label>
            <div className="grid grid-cols-10 gap-1">
              {iconNames.map((name) => {
                const Icon = PROJECT_ICONS[name];
                const active = selectedIcon === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedIcon(name)}
                    className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="WEB" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Website for SCCS" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Project for keeping track of web development for SCCS"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Members</Label>
            <UserMultiSelect users={users} name="memberIds" placeholder="Search members..." />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
