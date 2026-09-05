import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FilterBar, type FilterState } from "../components/FilterBar";
import { FilterSheet } from "../components/FilterSheet";
import { MapView } from "../components/MapView";
import { MobileMapExperience } from "../components/MobileMapExperience";
import { PlaceList } from "../components/PlaceList";
import { ViewModeToggle, type ViewMode } from "../components/ViewModeToggle";
import { defaultPriceUnit, getData, getPlacePriceForUnit, type PriceUnit } from "../lib/loadData";
import type { EnrichedPlace } from "../lib/types";

const data = getData();

function getMaxPrice(places: EnrichedPlace[], priceUnit: PriceUnit) {
  const max = Math.max(0, ...places.map((place) => getPlacePriceForUnit(place, priceUnit) ?? 0));
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
  const [filters, setFilters] = useState<FilterState>(() => ({
    maxPrice: getMaxPrice(cityPlaces, defaultPriceUnit),
    priceUnit: defaultPriceUnit,
    query: "",
    typeId: "all"
  }));
  const maxPrice = useMemo(() => getMaxPrice(cityPlaces, filters.priceUnit), [cityPlaces, filters.priceUnit]);
  const defaultFilters = useMemo<FilterState>(
    () => ({
      maxPrice: getMaxPrice(cityPlaces, defaultPriceUnit),
      priceUnit: defaultPriceUnit,
      query: "",
      typeId: "all"
    }),
    [cityPlaces]
  );
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setFilters((current) => {
      const nextMaxPrice = getMaxPrice(cityPlaces, current.priceUnit);

      if (current.maxPrice === nextMaxPrice) {
        return current;
      }

      return {
        ...current,
        maxPrice: nextMaxPrice
      };
    });
  }, [cityPlaces, citySlug, filters.priceUnit]);

  const filteredPlaces = useMemo(() => {
    const priceFilterIsActive = filters.maxPrice < maxPrice;

    return cityPlaces.filter((place) => {
      const matchesType = filters.typeId === "all" || place.type_id === filters.typeId;
      const placePrice = getPlacePriceForUnit(place, filters.priceUnit);
      const matchesPrice =
        !priceFilterIsActive ||
        (typeof placePrice === "number" && placePrice <= filters.maxPrice);

      return matchesType && matchesPrice && matchesSearch(place, filters.query);
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
    (filters.priceUnit !== defaultPriceUnit ? 1 : 0) +
    (filters.maxPrice < maxPrice ? 1 : 0);

  return (
    <>
      {isMobile ? (
        <MobileMapExperience
          activeFilterCount={activeFilterCount}
          city={city}
          onFilterClick={() => setIsFilterSheetOpen(true)}
          places={filteredPlaces}
          priceUnit={filters.priceUnit}
          siteTitle={data.config.site_title}
          totalCount={cityPlaces.length}
        />
      ) : null}

      {!isMobile ? (
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-5 lg:px-8">
          <header className="grid gap-x-3 gap-y-0 border-b border-zinc-200 pb-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <h1 className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 text-2xl font-semibold tracking-normal text-zinc-950 lg:text-3xl">
              <span className="whitespace-nowrap">{data.config.site_title}</span>
              <span className="text-sm font-medium text-accent">{city.name}, {city.country}</span>
            </h1>

            <FilterBar
              filters={filters}
              maxPrice={maxPrice}
              onChange={setFilters}
              placeTypes={data.placeTypes}
              trailing={<ViewModeToggle onChange={setViewMode} value={viewMode} />}
            />
          </header>

          {viewMode === "list" ? (
            <PlaceList places={filteredPlaces} priceUnit={filters.priceUnit} />
          ) : (
            <MapView city={city} places={filteredPlaces} priceUnit={filters.priceUnit} />
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
