import { X } from "lucide-react";

import { formatLastUpdatedAt } from "../lib/loadData";
import { FilterBar, type FilterState } from "./FilterBar";
import type { PlaceType, SiteConfig } from "../lib/types";

interface FilterSheetProps {
  config: SiteConfig;
  filters: FilterState;
  isOpen: boolean;
  maxPrice: number;
  onChange: (filters: FilterState) => void;
  onClose: () => void;
  onReset: () => void;
  placeTypes: PlaceType[];
}

export function FilterSheet({
  config,
  filters,
  isOpen,
  maxPrice,
  onChange,
  onClose,
  onReset,
  placeTypes
}: FilterSheetProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="presentation">
      <button
        aria-label="Close filters"
        className="absolute inset-0 h-full w-full bg-zinc-950/35"
        onClick={onClose}
        type="button"
      />
      <section
        aria-labelledby="mobile-filters-title"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 rounded-t-lg border border-zinc-200 bg-white p-4 shadow-[0_-18px_50px_rgba(24,24,27,0.18)]"
        role="dialog"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-300" />
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-zinc-950" id="mobile-filters-title">
            Filters
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="h-10 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700"
              onClick={onReset}
              type="button"
            >
              Reset
            </button>
            <button
              aria-label="Close filters"
              className="inline-grid h-10 w-10 place-items-center rounded-md border border-zinc-200 text-zinc-700"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <FilterBar
            filters={filters}
            layout="sheet"
            maxPrice={maxPrice}
            onChange={onChange}
            placeTypes={placeTypes}
          />
        </div>

        <div className="mt-5 border-t border-zinc-100 pt-4 text-center text-sm text-zinc-500">
          <p>
            Made with <span aria-label="love">♥</span> by{" "}
            <a
              className="font-medium text-zinc-950 underline-offset-4 hover:underline"
              href={config.author.linkedinUrl}
              rel="noreferrer"
              target="_blank"
            >
              {config.author.name}
            </a>
          </p>
          <p className="mt-1 text-xs text-zinc-400">Updated {formatLastUpdatedAt(config.lastUpdatedAt)}</p>
          <p className="mt-2 flex justify-center gap-3">
            <a
              className="underline-offset-4 hover:text-zinc-950 hover:underline"
              href={config.author.linkedinUrl}
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              className="underline-offset-4 hover:text-zinc-950 hover:underline"
              href={config.author.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
