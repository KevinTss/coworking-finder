import "maplibre-gl/dist/maplibre-gl.css";

import { ExternalLink, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";

import { formatOfferPrice, formatPlacePrice } from "../lib/loadData";
import { getMapsUrl, osmRasterStyle } from "../lib/maps";
import type { City, EnrichedPlace } from "../lib/types";

interface MobileMapExperienceProps {
  activeFilterCount: number;
  city: City;
  onFilterClick: () => void;
  places: EnrichedPlace[];
  siteTitle: string;
  totalCount: number;
}

const minSheetHeight = 210;
const maxSheetRatio = 0.72;

function getMarkerLabel(place: EnrichedPlace) {
  const price = place.priceForFilter;

  if (typeof price !== "number") {
    return place.type.icon;
  }

  return `${Math.round(price)}€`;
}

export function MobileMapExperience({
  activeFilterCount,
  city,
  onFilterClick,
  places,
  siteTitle,
  totalCount
}: MobileMapExperienceProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const markerElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [sheetHeight, setSheetHeight] = useState(() => Math.round(window.innerHeight * 0.42));
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId]
  );

  useEffect(() => {
    if (selectedPlaceId && !places.some((place) => place.id === selectedPlaceId)) {
      setSelectedPlaceId(null);
    }
  }, [places, selectedPlaceId]);

  useEffect(() => {
    const clampSheetHeight = () => {
      setSheetHeight((current) => {
        const maxHeight = Math.round(window.innerHeight * maxSheetRatio);
        return Math.min(Math.max(current, minSheetHeight), maxHeight);
      });
    };

    window.addEventListener("resize", clampSheetHeight);
    return () => window.removeEventListener("resize", clampSheetHeight);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | null = null;
    const markers: MapLibreMarker[] = [];

    async function mountMap() {
      const maplibregl = await import("maplibre-gl");

      if (cancelled || !mapContainerRef.current) {
        return;
      }

      markerElementsRef.current.clear();
      map = new maplibregl.Map({
        attributionControl: false,
        center: [city.lng, city.lat],
        container: mapContainerRef.current,
        interactive: true,
        style: osmRasterStyle,
        zoom: city.default_zoom
      });
      mapInstanceRef.current = map;

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

      places.forEach((place) => {
        const markerElement = document.createElement("button");

        markerElement.type = "button";
        markerElement.className = "map-price-marker";
        markerElement.ariaLabel = `Show ${place.name}`;
        markerElement.dataset.active = place.id === selectedPlaceId ? "true" : "false";
        markerElement.textContent = getMarkerLabel(place);
        markerElement.addEventListener("click", () => setSelectedPlaceId(place.id));
        markerElementsRef.current.set(place.id, markerElement);

        const marker = new maplibregl.Marker({ anchor: "bottom", element: markerElement })
          .setLngLat([place.lng, place.lat])
          .addTo(map as MapLibreMap);

        markers.push(marker);
      });

      if (places.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        places.forEach((place) => bounds.extend([place.lng, place.lat]));
        map.fitBounds(bounds, {
          maxZoom: 14,
          padding: { bottom: 260, left: 48, right: 48, top: 120 }
        });
      } else if (places[0]) {
        map.setCenter([places[0].lng, places[0].lat]);
        map.setZoom(15);
      }
    }

    void mountMap();

    return () => {
      cancelled = true;
      markers.forEach((marker) => marker.remove());
      map?.remove();
      if (mapInstanceRef.current === map) {
        mapInstanceRef.current = null;
      }
      markerElementsRef.current.clear();
    };
  }, [city.default_zoom, city.id, city.lat, city.lng, places]);

  useEffect(() => {
    markerElementsRef.current.forEach((element, placeId) => {
      element.dataset.active = placeId === selectedPlaceId ? "true" : "false";
    });

    const map = mapInstanceRef.current;
    const place = places.find((candidate) => candidate.id === selectedPlaceId);

    if (map && place) {
      map.easeTo({ center: [place.lng, place.lat], duration: 250, zoom: Math.max(map.getZoom(), 13.5) });
    }
  }, [places, selectedPlaceId]);

  const startSheetDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const startY = event.clientY;
    const startHeight = sheetHeight;
    const maxHeight = Math.round(window.innerHeight * maxSheetRatio);

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDraggingSheet(true);

    const updateHeight = (moveEvent: PointerEvent) => {
      const nextHeight = startHeight + startY - moveEvent.clientY;
      setSheetHeight(Math.min(maxHeight, Math.max(minSheetHeight, nextHeight)));
    };

    const finishDrag = () => {
      setIsDraggingSheet(false);
      window.removeEventListener("pointermove", updateHeight);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };

    window.addEventListener("pointermove", updateHeight);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
  };

  return (
    <section className="relative h-[100dvh] overflow-hidden bg-zinc-100 md:hidden">
      <div
        aria-label={`Map of coworking places in ${city.name}`}
        className="absolute inset-0"
        ref={mapContainerRef}
        role="img"
      />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white/95 px-3 py-2 shadow-[0_8px_30px_rgba(24,24,27,0.12)] backdrop-blur">
          <h1 className="min-w-0 truncate text-base font-semibold text-zinc-950">
            {siteTitle}
            <span className="ml-2 text-sm font-medium text-accent">{city.name}, {city.country}</span>
          </h1>
          <button
            aria-label="Open filters"
            className="relative inline-grid h-10 w-10 shrink-0 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-950"
            onClick={onFilterClick}
            type="button"
          >
            <SlidersHorizontal aria-hidden="true" className="h-5 w-5" />
            {activeFilterCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      {!selectedPlace ? (
        <section
          className={`absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-lg border border-zinc-200 bg-white shadow-[0_-16px_40px_rgba(24,24,27,0.16)] ${
            isDraggingSheet ? "" : "transition-[height] duration-200"
          }`}
          style={{ height: `${sheetHeight}px` }}
        >
          <button
            aria-label="Drag results panel"
            className="flex h-10 shrink-0 touch-none items-center justify-center"
            onPointerDown={startSheetDrag}
            type="button"
          >
            <span className="h-1 w-12 rounded-full bg-zinc-300" />
          </button>

          <div className="border-b border-zinc-100 px-5 pb-3">
            <h2 className="text-lg font-semibold text-zinc-950">Spaces in {city.name}</h2>
            {places.length !== totalCount ? (
              <p className="mt-1 text-sm text-zinc-500">Filtered results</p>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-4">
            {places.length ? (
              <div className="space-y-4">
                {places.map((place) => (
                  <button
                    className="grid w-full gap-2 rounded-md border border-zinc-200 bg-white p-3 text-left active:scale-[0.99]"
                    key={place.id}
                    onClick={() => setSelectedPlaceId(place.id)}
                    type="button"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-base font-semibold text-zinc-950">{place.name}</span>
                      <span className="rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
                        {place.type.icon}
                      </span>
                    </span>
                    <span className="line-clamp-2 text-sm leading-5 text-zinc-500">{place.address}</span>
                    <span className="text-sm font-medium text-zinc-950">{formatPlacePrice(place)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center">
                <h2 className="text-base font-semibold text-zinc-950">No matching places</h2>
                <p className="mt-2 text-sm text-zinc-500">Try adjusting the filters.</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <SelectedPlaceCard place={selectedPlace} onClose={() => setSelectedPlaceId(null)} />
      )}
    </section>
  );
}

function SelectedPlaceCard({ onClose, place }: { onClose: () => void; place: EnrichedPlace }) {
  return (
    <article className="absolute inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-30 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_18px_60px_rgba(24,24,27,0.2)]">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <span className="w-fit rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
            {place.type.icon} {place.type.label}
          </span>
          <h2 className="mt-3 truncate text-lg font-semibold text-zinc-950">{place.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-500">{place.address}</p>
          <p className="mt-3 text-sm font-medium text-zinc-950">{formatPlacePrice(place)}</p>
        </div>
        <button
          aria-label="Close selected place"
          className="inline-grid h-10 w-10 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-800"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {place.offers.length ? (
        <div className="border-t border-zinc-100 px-4 py-3">
          <ul className="flex gap-2 overflow-x-auto">
            {place.offers.slice(0, 4).map((offer) => (
              <li
                className="shrink-0 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700"
                key={offer.id}
              >
                {offer.label}: {formatOfferPrice(offer, place.price_currency)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex gap-2 border-t border-zinc-100 p-3">
        <a
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white"
          href={place.website_url}
          rel="noreferrer"
          target="_blank"
        >
          Website
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>
        <a
          aria-label="Open in Maps"
          className="inline-grid h-10 w-12 place-items-center rounded-md border border-zinc-200 text-zinc-900"
          href={getMapsUrl(place)}
          rel="noreferrer"
          target="_blank"
        >
          <MapPin aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
