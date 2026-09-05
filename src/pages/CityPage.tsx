import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FilterBar, type FilterState } from "../components/FilterBar";
import { FilterSheet } from "../components/FilterSheet";
import { MapView } from "../components/MapView";
import { MobileMapExperience } from "../components/MobileMapExperience";
import { PlaceList } from "../components/PlaceList";
import { ViewModeToggle, type ViewMode } from "../components/ViewModeToggle";
import { getData } from "../lib/loadData";
import type { EnrichedPlace } from "../lib/types";

const data = getData();

function getMaxPrice(places: EnrichedPlace[]) {
  const max = Math.max(0, ...places.map((place) => place.priceForFilter ?? 0));
  return Math.max(25, Math.ceil(max / 25) * 25);
}

function matchesSearch(place: EnrichedPlace, query: string) {
  if (!query.trim()) {
    return true;
  }

  const haystack = [place.name, place.address, place.type.label, ...place.tags.map((tag) => tag.label)]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.trim().toLowerCase());
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

export function CityPage() {
  const { citySlug = data.config.default_city } = useParams();
  const navigate = useNavigate();
  const city = data.cities.find((candidate) => candidate.id === citySlug);
  const cityPlaces = useMemo(
    () => data.places.filter((place) => place.city_id === citySlug),
    [citySlug]
  );
  const maxPrice = useMemo(() => getMaxPrice(cityPlaces), [cityPlaces]);
  const defaultFilters = useMemo<FilterState>(
    () => ({
      maxPrice,
      query: "",
      testedOnly: false,
      typeId: "all"
    }),
    [maxPrice]
  );
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      maxPrice
    }));
  }, [citySlug, maxPrice]);

  const filteredPlaces = useMemo(() => {
    const priceFilterIsActive = filters.maxPrice < maxPrice;

    return cityPlaces.filter((place) => {
      const matchesType = filters.typeId === "all" || place.type_id === filters.typeId;
      const matchesTested = !filters.testedOnly || place.reviews.length > 0;
      const matchesPrice =
        !priceFilterIsActive ||
        (typeof place.priceForFilter === "number" && place.priceForFilter <= filters.maxPrice);

      return matchesType && matchesTested && matchesPrice && matchesSearch(place, filters.query);
    });
  }, [cityPlaces, filters, maxPrice]);

  if (!city) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">Unknown city</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">No data for {citySlug}</h1>
        <button
          className="mt-6 w-fit rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-950"
          onClick={() => navigate(`/${data.config.default_city}`)}
          type="button"
        >
          Open {data.config.default_city}
        </button>
      </section>
    );
  }

  const activeFilterCount =
    (filters.query.trim() ? 1 : 0) +
    (filters.typeId !== "all" ? 1 : 0) +
    (filters.testedOnly ? 1 : 0) +
    (filters.maxPrice < maxPrice ? 1 : 0);

  return (
    <>
      {isMobile ? (
        <MobileMapExperience
          activeFilterCount={activeFilterCount}
          city={city}
          onFilterClick={() => setIsFilterSheetOpen(true)}
          places={filteredPlaces}
          siteTitle={data.config.site_title}
          totalCount={cityPlaces.length}
        />
      ) : null}

      {!isMobile ? (
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 lg:px-8">
          <header className="border-b border-zinc-200 pb-5">
            <h1 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-4xl font-semibold tracking-normal text-zinc-950 lg:text-5xl">
              {data.config.site_title}
              <span className="text-base font-medium text-accent">{city.name}, {city.country}</span>
            </h1>
          </header>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <FilterBar
              filters={filters}
              maxPrice={maxPrice}
              onChange={setFilters}
              placeTypes={data.placeTypes}
            />
            <ViewModeToggle onChange={setViewMode} value={viewMode} />
          </div>

          {viewMode === "list" ? (
            <PlaceList places={filteredPlaces} />
          ) : (
            <MapView city={city} places={filteredPlaces} />
          )}
        </section>
      ) : null}

      <FilterSheet
        config={data.config}
        filters={filters}
        isOpen={isFilterSheetOpen}
        maxPrice={maxPrice}
        onChange={setFilters}
        onClose={() => setIsFilterSheetOpen(false)}
        onReset={() => setFilters(defaultFilters)}
        placeTypes={data.placeTypes}
      />
    </>
  );
}
