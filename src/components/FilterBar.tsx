import { Search } from "lucide-react";

import { formatCurrency } from "../lib/loadData";
import type { PlaceType } from "../lib/types";

export interface FilterState {
  maxPrice: number;
  query: string;
  testedOnly: boolean;
  typeId: string;
}

interface FilterBarProps {
  filters: FilterState;
  layout?: "desktop" | "sheet";
  maxPrice: number;
  onChange: (filters: FilterState) => void;
  placeTypes: PlaceType[];
}

export function FilterBar({ filters, layout = "desktop", maxPrice, onChange, placeTypes }: FilterBarProps) {
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
  const containerClassName =
    layout === "sheet"
      ? "grid gap-4"
      : "grid gap-3 rounded-md border border-zinc-200 bg-white p-3 md:grid-cols-[minmax(220px,1fr)_auto_220px_auto] md:items-center";

  return (
    <section
      aria-label="Filters"
      className={containerClassName}
    >
      <label className="flex flex-col gap-1 text-sm text-zinc-600">
        <span className="text-xs font-medium uppercase text-zinc-400">Search</span>
        <span className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
            onChange={(event) => update({ query: event.target.value })}
            placeholder="Name, district, tag"
            type="search"
            value={filters.query}
          />
        </span>
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase text-zinc-400">Type</span>
        <div className={`flex h-10 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 p-0.5 ${layout === "sheet" ? "w-full" : ""}`}>
          {[{ id: "all", label: "All", icon: "" }, ...placeTypes].map((type) => {
            const active = filters.typeId === type.id;

            return (
              <button
                aria-pressed={active}
                className={`whitespace-nowrap rounded px-3 text-sm font-medium transition ${
                  layout === "sheet" ? "flex-1" : ""
                } ${
                  active ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-white hover:text-zinc-950"
                }`}
                key={type.id}
                onClick={() => update({ typeId: type.id })}
                type="button"
              >
                {type.icon ? `${type.icon} ` : ""}
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm text-zinc-600">
        <span className="text-xs font-medium uppercase text-zinc-400">
          Max price: {formatCurrency(filters.maxPrice)}
        </span>
        <input
          className="h-10 accent-accent"
          max={maxPrice}
          min={0}
          onChange={(event) => update({ maxPrice: Number(event.target.value) })}
          step={5}
          type="range"
          value={Math.min(filters.maxPrice, maxPrice)}
        />
      </label>

      <label className="flex h-10 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700">
        <input
          checked={filters.testedOnly}
          className="h-4 w-4 rounded border-zinc-300 accent-accent"
          onChange={(event) => update({ testedOnly: event.target.checked })}
          type="checkbox"
        />
        Tested
      </label>
    </section>
  );
}
