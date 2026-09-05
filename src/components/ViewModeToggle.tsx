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
      className="flex gap-1"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const active = value === mode.id;

        return (
          <button
            aria-pressed={active}
            className={`inline-flex h-10 items-center gap-2 rounded px-3 text-sm font-medium transition ${
              active
                ? "border border-zinc-950 bg-zinc-950 text-white"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-white hover:text-zinc-950"
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
