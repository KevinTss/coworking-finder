import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { defaultPriceUnit, formatCurrency, priceUnitOptions, type PriceUnit } from "../lib/loadData";
import type { PlaceType, PlaceTypeId } from "../lib/types";

export interface FilterState {
  maxPrice: number;
  priceUnit: PriceUnit;
  query: string;
  typeId: PlaceTypeId | "all";
}

interface FilterBarProps {
  filters: FilterState;
  layout?: "desktop" | "sheet";
  maxPrice: number;
  onChange: (filters: FilterState) => void;
  placeTypes: PlaceType[];
  trailing?: ReactNode;
}

export function FilterBar({ filters, layout = "desktop", maxPrice, onChange, placeTypes, trailing }: FilterBarProps) {
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
  const isSheet = layout === "sheet";
  const queryIsActive = Boolean(filters.query.trim());
  const advancedFiltersAreActive =
    filters.typeId !== "all" ||
    filters.priceUnit !== defaultPriceUnit ||
    filters.maxPrice < maxPrice;
  const [isSearchOpen, setIsSearchOpen] = useState(queryIsActive);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(advancedFiltersAreActive);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (queryIsActive) {
      setIsSearchOpen(true);
    }
  }, [queryIsActive]);

  useEffect(() => {
    if (advancedFiltersAreActive) {
      setIsFilterPanelOpen(true);
    }
  }, [advancedFiltersAreActive]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const typeOptions: Array<{ id: PlaceTypeId | "all"; label: string; icon: string }> = [
    { id: "all", label: "All", icon: "" },
    ...placeTypes
  ];
  const priceStep = filters.priceUnit === "month" ? 25 : 5;
  const selectedMaxPrice = Math.min(filters.maxPrice, maxPrice);

  const renderPriceUnitButtons = (variant: "inline" | "sheet") => (
    <div className={variant === "sheet" ? "grid grid-cols-3 gap-1" : "inline-flex h-9 items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-0.5"}>
      {priceUnitOptions.map((unit) => {
        const active = filters.priceUnit === unit.id;

        return (
          <button
            aria-pressed={active}
            className={`rounded text-sm font-medium transition ${
              variant === "sheet" ? "h-10 px-3" : "h-8 px-3"
            } ${
              active
                ? "bg-zinc-950 text-white shadow-sm"
                : "text-zinc-500 hover:bg-white hover:text-zinc-950"
            }`}
            key={unit.id}
            onClick={() => update({ priceUnit: unit.id })}
            type="button"
          >
            {variant === "sheet" ? unit.shortLabel : unit.label}
          </button>
        );
      })}
    </div>
  );

  const renderTypeButtons = (variant: "inline" | "sheet") => (
    <div className={variant === "sheet" ? "grid grid-cols-2 gap-1" : "inline-flex h-9 items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-0.5"}>
      {typeOptions.map((type) => {
        const active = filters.typeId === type.id;

        return (
          <button
            aria-pressed={active}
            className={`whitespace-nowrap rounded text-sm font-medium transition ${
              variant === "sheet" ? "h-10 px-3" : "h-8 px-3"
            } ${
              active
                ? "bg-zinc-950 text-white shadow-sm"
                : "text-zinc-500 hover:bg-white hover:text-zinc-950"
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
  );

  const renderPriceRange = (variant: "inline" | "sheet") => (
    <label
      aria-label={`Maximum price ${formatCurrency(selectedMaxPrice)}`}
      className={
        variant === "sheet"
          ? "flex flex-col gap-2 text-sm text-zinc-600"
          : "flex h-9 items-center gap-3 text-sm text-zinc-600"
      }
    >
      <span className={variant === "sheet" ? "text-xs font-medium uppercase text-zinc-400" : "min-w-16 font-medium text-zinc-900"}>
        Max {formatCurrency(selectedMaxPrice)}
      </span>
      <input
        className={variant === "sheet" ? "h-10 accent-accent" : "h-2 w-40 accent-accent"}
        max={maxPrice}
        min={0}
        onChange={(event) => update({ maxPrice: Number(event.target.value) })}
        step={priceStep}
        type="range"
        value={selectedMaxPrice}
      />
    </label>
  );

  if (isSheet) {
    return (
      <section aria-label="Filters" className="grid gap-4">
        <label className="flex flex-col gap-1 text-sm text-zinc-600">
          <span className="text-xs font-medium uppercase text-zinc-400">Search</span>
          <span className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
              onChange={(event) => update({ query: event.target.value })}
              placeholder="Name, district, tag"
              role="searchbox"
              type="text"
              value={filters.query}
            />
          </span>
        </label>

        <div className="grid gap-1">
          <span className="text-xs font-medium uppercase text-zinc-400">Price frequency</span>
          {renderPriceUnitButtons("sheet")}
        </div>

        <div className="grid gap-1">
          <span className="text-xs font-medium uppercase text-zinc-400">Type</span>
          {renderTypeButtons("sheet")}
        </div>

        {renderPriceRange("sheet")}
      </section>
    );
  }

  return (
    <section aria-label="Filters" className="contents">
      <div className="flex items-center justify-end justify-self-end gap-1.5">
        {!isSearchOpen ? (
          <button
            aria-label="Open search"
            className={`inline-grid h-9 w-9 place-items-center rounded-md border transition ${
              queryIsActive
                ? "border-teal-200 bg-teal-50 text-accent"
                : "border-transparent text-zinc-500 hover:border-zinc-200 hover:bg-white hover:text-zinc-950"
            }`}
            onClick={() => setIsSearchOpen(true)}
            type="button"
          >
            <Search aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : (
          <span className="relative block w-[320px] max-w-[min(320px,60vw)]">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            />
            <input
              ref={searchInputRef}
              className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-8 pr-9 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300"
              onChange={(event) => update({ query: event.target.value })}
              placeholder="Search places..."
              role="searchbox"
              type="text"
              value={filters.query}
            />
            <button
              aria-label={queryIsActive ? "Clear search" : "Close search"}
              className="absolute right-1 top-1/2 inline-grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950"
              onClick={() => {
                if (queryIsActive) {
                  update({ query: "" });
                } else {
                  setIsSearchOpen(false);
                }
              }}
              type="button"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </span>
        )}

        <button
          aria-expanded={isFilterPanelOpen}
          aria-label="Open filters"
          className={`relative inline-grid h-9 w-9 place-items-center rounded-md border transition ${
            advancedFiltersAreActive
              ? "border-teal-200 bg-teal-50 text-accent"
              : "border-transparent text-zinc-500 hover:border-zinc-200 hover:bg-white hover:text-zinc-950"
          }`}
          onClick={() => setIsFilterPanelOpen((current) => !current)}
          type="button"
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
          {advancedFiltersAreActive ? (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          ) : null}
        </button>
        {trailing}
      </div>

      <div
        aria-hidden={!isFilterPanelOpen}
        className={`col-span-full grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isFilterPanelOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-3 flex w-full flex-wrap items-center gap-3 border-t border-zinc-200/80 pt-3">
            {renderPriceUnitButtons("inline")}
            {renderTypeButtons("inline")}
            <div className="ml-auto">{renderPriceRange("inline")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
