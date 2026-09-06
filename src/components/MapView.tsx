import "maplibre-gl/dist/maplibre-gl.css";

import { ExternalLink, MapPin, Star, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";

import { formatOfferPrice, formatPlacePriceForUnit, getPlacePriceForUnit, type PriceUnit } from "../lib/loadData";
import { getMapsUrl, osmRasterStyle } from "../lib/maps";
import type { City, EnrichedPlace } from "../lib/types";

interface MapViewProps {
  city: City;
  places: EnrichedPlace[];
  priceUnit: PriceUnit;
}

function getMarkerLabel(place: EnrichedPlace, priceUnit: PriceUnit) {
  const price = getPlacePriceForUnit(place, priceUnit);

  if (typeof price !== "number") {
    return place.type.icon;
  }

  return `${Math.round(price)}€`;
}

export function MapView({ city, places, priceUnit }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const markerElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

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
        zoom: city.defaultZoom
      });
      mapInstanceRef.current = map;

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

      places.forEach((place) => {
        const markerElement = document.createElement("button");

        markerElement.type = "button";
        markerElement.className = "map-price-marker";
        markerElement.ariaLabel = `Show ${place.name}`;
        markerElement.dataset.active = place.id === selectedPlaceId ? "true" : "false";
        markerElement.textContent = getMarkerLabel(place, priceUnit);
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
          padding: { bottom: 420, left: 96, right: 96, top: 120 }
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
  }, [city.defaultZoom, city.id, city.lat, city.lng, places, priceUnit]);

  useEffect(() => {
    markerElementsRef.current.forEach((element, placeId) => {
      element.dataset.active = placeId === selectedPlaceId ? "true" : "false";
    });

    const map = mapInstanceRef.current;
    const place = places.find((candidate) => candidate.id === selectedPlaceId);
    if (map && place) {
      map.easeTo({
        center: [place.lng, place.lat],
        duration: 250,
        offset: [0, -80],
        zoom: Math.max(map.getZoom(), 13.5)
      });
    }
  }, [places, selectedPlaceId]);

  if (!places.length) {
    return (
      <div className="rounded-md border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
        <h2 className="text-lg font-semibold text-zinc-950">No matching places</h2>
        <p className="mt-2 text-sm text-zinc-500">Try adjusting the filters.</p>
      </div>
    );
  }

  return (
    <section className="pointer-events-none relative -mb-5 mt-4 min-h-[calc(100vh-7rem)] overflow-visible">
      <div className="pointer-events-auto fixed inset-0 z-0 overflow-hidden bg-zinc-100">
        <div
          aria-label={`Map of ${places.length} places in ${city.name}`}
          className="h-full w-full"
          ref={mapContainerRef}
          role="img"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-50/75 to-transparent" />
      </div>

      <div
        aria-hidden={Boolean(selectedPlace)}
        className={`pointer-events-none relative z-10 min-h-[calc(100vh-7rem)] pb-16 pt-[min(42vh,360px)] transition-all duration-300 ease-out ${
          selectedPlace ? "pointer-events-none translate-y-8 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <DesktopMapListSheet
          city={city}
          onSelectPlace={setSelectedPlaceId}
          places={places}
          priceUnit={priceUnit}
        />
      </div>

      <div
        className={`pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center px-6 transition-all duration-300 ease-out ${
          selectedPlace ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {selectedPlace ? (
          <SelectedPlaceMapCard
            onClose={() => setSelectedPlaceId(null)}
            place={selectedPlace}
            priceUnit={priceUnit}
          />
        ) : null}
      </div>
    </section>
  );
}

function DesktopMapListSheet({
  city,
  onSelectPlace,
  places,
  priceUnit
}: {
  city: City;
  onSelectPlace: (placeId: string) => void;
  places: EnrichedPlace[];
  priceUnit: PriceUnit;
}) {
  return (
    <section className="pointer-events-auto mx-auto min-h-screen w-[min(1180px,calc(100%-3rem))] overflow-hidden rounded-t-lg border border-zinc-200 bg-white/95 shadow-[0_-18px_60px_rgba(24,24,27,0.16)] backdrop-blur">
      <div className="flex h-10 items-center justify-center">
        <span className="h-1 w-14 rounded-full bg-zinc-300" />
      </div>

      <div className="px-8 pb-12 pt-6">
        <div className="grid gap-4">
          {places.map((place) => (
            <button
              className="group grid min-h-[132px] w-full grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-3 rounded-md border border-zinc-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_14px_34px_rgba(24,24,27,0.08)] focus:outline-none focus:ring-2 focus:ring-accent/25"
              key={place.id}
              onClick={() => onSelectPlace(place.id)}
              type="button"
            >
              <span className="min-w-0">
                <span className="block truncate text-lg font-semibold text-zinc-950">{place.name}</span>
                <span className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-500">{place.address}</span>
              </span>
              <span className="shrink-0 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
                {place.type.icon}
              </span>

              <span className="flex min-w-0 flex-wrap items-end justify-between gap-x-6 gap-y-2 self-end">
                <span>
                  <span className="block text-base font-semibold text-zinc-950">{formatPlacePriceForUnit(place, priceUnit)}</span>
                  <span className="mt-2 block text-sm font-medium text-zinc-500">Laptop: {place.laptopPolicy.availability}</span>
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-zinc-500">
                  {place.averageRating ? (
                    <>
                      <Star aria-hidden="true" className="h-3.5 w-3.5 fill-zinc-700 text-zinc-700" />
                      {place.averageRating}
                    </>
                  ) : (
                    "No reviews"
                  )}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelectedPlaceMapCard({
  onClose,
  place,
  priceUnit
}: {
  onClose: () => void;
  place: EnrichedPlace;
  priceUnit: PriceUnit;
}) {
  return (
    <article className="pointer-events-auto w-[min(560px,calc(100%-2rem))] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_18px_60px_rgba(24,24,27,0.22)]">
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0">
          <span className="w-fit rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
            {place.type.icon} {place.type.label}
          </span>
          <h2 className="mt-3 truncate text-lg font-semibold text-zinc-950">{place.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-500">{place.address}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm font-medium text-zinc-950">{formatPlacePriceForUnit(place, priceUnit)}</p>
            <p className="flex items-center gap-1.5 text-sm text-zinc-600">
              {place.averageRating ? (
                <>
                  <Star aria-hidden="true" className="h-4 w-4 fill-zinc-950 text-zinc-950" />
                  {place.averageRating}
                </>
              ) : (
                "No reviews yet"
              )}
            </p>
          </div>
          <p className="mt-2 text-xs font-medium text-zinc-500">Laptop: {place.laptopPolicy.availability}</p>
        </div>
        <button
          aria-label="Close selected place"
          className="inline-grid h-10 w-10 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
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
                {offer.label}: {formatOfferPrice(offer, place.priceCurrency)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex gap-2 border-t border-zinc-100 p-3">
        <a
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          href={place.websiteUrl}
          rel="noreferrer"
          target="_blank"
        >
          Website
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>
        <a
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
          href={getMapsUrl(place)}
          rel="noreferrer"
          target="_blank"
        >
          Open in Maps
          <MapPin aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
