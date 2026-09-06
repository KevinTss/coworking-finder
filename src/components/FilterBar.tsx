import { Building2, CalendarDays, CalendarRange, Clock3, Coffee, LayoutGrid, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { defaultPriceUnit, formatCurrency, type PriceUnit } from "../lib/loadData";
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

interface SegmentedOption<T extends string> {
  id: T;
  icon: ReactNode;
  label: string;
  tooltip: string;
}

function SegmentedToggle<T extends string>({
  ariaLabel,
  onChange,
  options,
  value,
  variant
}: {
  ariaLabel: string;
  onChange: (value: T) => void;
  options: Array<SegmentedOption<T>>;
  value: T;
  variant: "inline" | "sheet";
}) {
  const activeIndex = Math.max(0, options.findIndex((option) => option.id === value));
  const optionCount = options.length;

  return (
    <div
      aria-label={ariaLabel}
      className={`relative grid shrink-0 rounded-full border border-zinc-200 bg-zinc-100 p-1 text-zinc-500 shadow-inner ${
        variant === "sheet" ? "h-12 w-full" : "h-9 w-[250px]"
      }`}
      role="group"
      style={{ gridTemplateColumns: `repeat(${optionCount}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-1 left-1 top-1 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(${activeIndex * 100}%)`,
          width: `calc((100% - 0.5rem) / ${optionCount})`
        }}
      />
      {options.map((option) => {
        const active = option.id === value;

        return (
          <button
            aria-label={option.tooltip}
            aria-pressed={active}
            className={`group relative z-10 inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent/20 ${
              variant === "sheet" ? "h-10 px-2" : "h-7 px-2"
            } ${active ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-700"}`}
            key={option.id}
            onClick={() => onChange(option.id)}
            title={option.tooltip}
            type="button"
          >
            <span className="grid h-4 w-4 shrink-0 place-items-center">{option.icon}</span>
            <span className="truncate">{option.label}</span>
            <span
              className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-950 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100"
              role="tooltip"
            >
              {option.tooltip}
            </span>
          </button>
        );
      })}
    </div>
  );
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

  const typeOptions: Array<SegmentedOption<PlaceTypeId | "all">> = [
    {
      id: "all",
      icon: <LayoutGrid aria-hidden="true" className="h-4 w-4" />,
      label: "All",
      tooltip: "Show all place types"
    },
    ...placeTypes.map((type) => ({
      id: type.id,
      icon:
        type.id === "coworking" ? (
          <Building2 aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Coffee aria-hidden="true" className="h-4 w-4" />
        ),
      label: type.id === "coworking" ? "Coworking" : "Café",
      tooltip: `Show only ${type.label.toLowerCase()}`
    }))
  ];
  const priceStep = filters.priceUnit === "month" ? 25 : 5;
  const selectedMaxPrice = Math.min(filters.maxPrice, maxPrice);
  const priceOptions: Array<SegmentedOption<PriceUnit>> = [
    {
      id: "hour",
      icon: <Clock3 aria-hidden="true" className="h-4 w-4" />,
      label: "Hour",
      tooltip: "Show hourly prices"
    },
    {
      id: "day",
      icon: <CalendarDays aria-hidden="true" className="h-4 w-4" />,
      label: "Day",
      tooltip: "Show day prices"
    },
    {
      id: "month",
      icon: <CalendarRange aria-hidden="true" className="h-4 w-4" />,
      label: "Month",
      tooltip: "Show monthly prices"
    }
  ];

  const renderPriceUnitButtons = (variant: "inline" | "sheet") => (
    <SegmentedToggle
      ariaLabel="Price frequency"
      onChange={(priceUnit) => update({ priceUnit })}
      options={priceOptions}
      value={filters.priceUnit}
      variant={variant}
    />
  );

  const renderTypeButtons = (variant: "inline" | "sheet") => (
    <SegmentedToggle
      ariaLabel="Place type"
      onChange={(typeId) => update({ typeId })}
      options={typeOptions}
      value={filters.typeId}
      variant={variant}
    />
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
        <div className={`min-h-0 ${isFilterPanelOpen ? "overflow-visible" : "overflow-hidden"}`}>
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
