"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type User = { id: number; name: string; email: string };

export function UserMultiSelect({
  users,
  name,
  placeholder = "Search people...",
}: {
  users: User[];
  name: string;
  placeholder?: string;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User[]>([]);

  const filtered = users.filter(
    (u) =>
      !selected.find((s) => s.id === u.id) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())),
  );

  const add = (user: User) => {
    setSelected((prev) => [...prev, user]);
    setSearch("");
  };

  const remove = (id: number) =>
    setSelected((prev) => prev.filter((u) => u.id !== id));

  return (
    <div className="flex flex-col gap-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((u) => (
            <Badge key={u.id} variant="secondary" className="gap-1 pr-1">
              {u.name}
              <button type="button" onClick={() => remove(u.id)} className="ml-1 rounded-full hover:bg-muted">
                <X className="size-3" />
              </button>
              <input type="hidden" name={name} value={u.id} />
            </Badge>
          ))}
        </div>
      )}
      <Input
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />
      {search && filtered.length > 0 && (
        <div className="flex flex-col rounded-md border bg-background shadow-sm max-h-40 overflow-y-auto">
          {filtered.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => add(u)}
              className="flex flex-col px-3 py-2 text-left hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium">{u.name}</span>
              <span className="text-xs text-muted-foreground">{u.email}</span>
            </button>
          ))}
        </div>
      )}
      {search && filtered.length === 0 && (
        <p className="text-xs text-muted-foreground px-1">No users found.</p>
      )}
    </div>
  );
}
