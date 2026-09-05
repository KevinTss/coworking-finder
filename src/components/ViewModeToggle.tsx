import { List, Map } from "lucide-react";

export type ViewMode = "list" | "map";

interface ViewModeToggleProps {
  onChange: (mode: ViewMode) => void;
  value: ViewMode;
}

export function ViewModeToggle({ onChange, value }: ViewModeToggleProps) {
  const nextMode: ViewMode = value === "list" ? "map" : "list";
  const tooltip = `Switch to ${nextMode}`;

  return (
    <button
      aria-label={tooltip}
      className="group relative inline-flex h-9 w-[68px] shrink-0 items-center rounded-full border border-zinc-200 bg-zinc-100 p-1 text-zinc-500 shadow-inner transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-accent/20"
      onClick={() => onChange(nextMode)}
      title={tooltip}
      type="button"
    >
      <span
        aria-hidden="true"
        className={`absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
          value === "map" ? "translate-x-8" : "translate-x-0"
        }`}
      />
      <span className="relative z-10 grid h-7 w-7 place-items-center">
        <List
          aria-hidden="true"
          className={`h-4 w-4 transition ${value === "list" ? "text-zinc-950" : "text-zinc-400"}`}
        />
      </span>
      <span className="relative z-10 grid h-7 w-7 place-items-center">
        <Map
          aria-hidden="true"
          className={`h-4 w-4 transition ${value === "map" ? "text-zinc-950" : "text-zinc-400"}`}
        />
      </span>
      <span
        className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md bg-zinc-950 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100"
        role="tooltip"
      >
        {tooltip}
      </span>
    </button>
  );
}
