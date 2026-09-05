import { List, Map } from "lucide-react";

export type ViewMode = "list" | "map";

interface ViewModeToggleProps {
  onChange: (mode: ViewMode) => void;
  value: ViewMode;
}

const modes: Array<{ icon: typeof List; id: ViewMode; label: string }> = [
  { icon: List, id: "list", label: "List" },
  { icon: Map, id: "map", label: "Map" }
];

export function ViewModeToggle({ onChange, value }: ViewModeToggleProps) {
  return (
    <section
      aria-label="View mode"
      className="flex rounded-md border border-zinc-200 bg-white p-1"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const active = value === mode.id;

        return (
          <button
            aria-pressed={active}
            className={`inline-flex h-10 items-center gap-2 rounded px-3 text-sm font-medium transition ${
              active ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
            }`}
            key={mode.id}
            onClick={() => onChange(mode.id)}
            type="button"
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {mode.label}
          </button>
        );
      })}
    </section>
  );
}
