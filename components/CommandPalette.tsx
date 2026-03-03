import * as React from "react";
import { Command } from "cmdk";
import commands from "@/data/commands.json";
import profile from "@/data/profile.json";

type CommandItem = {
  id: string;
  title: string;
};

export default function CommandPalette({
  onOpen,
}: {
  onOpen: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelect = (id: string) => {
    if (id === "resume") {
      window.open(profile.links.resume, "_blank", "noopener,noreferrer");
      setOpen(false);
      return;
    }

    onOpen(id);
    setOpen(false);
  };

  const commandList = commands as CommandItem[];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-start p-6">
      <Command className="window w-full max-w-xl p-2">
        <Command.Input
          className="w-full bg-transparent p-2 text-sm outline-none"
          placeholder="Type a command… (about, projects, contact, resume)"
        />
        <Command.List>
          {commandList.map((command) => (
            <Command.Item
              key={command.id}
              className="cursor-pointer rounded-md px-2 py-1.5 text-sm text-white/80 hover:bg-white/5"
              onSelect={() => handleSelect(command.id)}
            >
              {command.title}
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
