import "maplibre-gl/dist/maplibre-gl.css";

import { ExternalLink, MapPin, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";

import { formatOfferPrice, formatPlacePriceForUnit, type PriceUnit } from "../lib/loadData";
import { getMapsUrl, osmRasterStyle } from "../lib/maps";
import type { City, EnrichedPlace } from "../lib/types";

interface MapViewProps {
  city: City;
  places: EnrichedPlace[];
  priceUnit: PriceUnit;
}

export function MapView({ city, places, priceUnit }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const markerElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(places[0]?.id ?? null);

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedPlaceId) ?? places[0] ?? null,
    [places, selectedPlaceId]
  );

  useEffect(() => {
    if (!places.length) {
      setSelectedPlaceId(null);
      return;
    }

    if (!selectedPlaceId || !places.some((place) => place.id === selectedPlaceId)) {
      setSelectedPlaceId(places[0].id);
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

      places.forEach((place, index) => {
        const markerElement = document.createElement("button");
        const markerDot = document.createElement("span");

        markerElement.type = "button";
        markerElement.className = "map-marker";
        markerElement.ariaLabel = `Select ${place.name}`;
        markerElement.dataset.active = place.id === selectedPlaceId ? "true" : "false";
        markerDot.className = "map-marker__dot";
        markerElement.append(markerDot);
        markerElement.addEventListener("click", () => setSelectedPlaceId(place.id));
        markerElementsRef.current.set(place.id, markerElement);

        const marker = new maplibregl.Marker({ anchor: "bottom", element: markerElement })
          .setLngLat([place.lng, place.lat])
          .addTo(map as MapLibreMap);

        markers.push(marker);

        if (index === 0 && places.length === 1) {
          map?.setCenter([place.lng, place.lat]);
          map?.setZoom(15);
        }
      });

      if (places.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        places.forEach((place) => bounds.extend([place.lng, place.lat]));
        map.fitBounds(bounds, { maxZoom: 14, padding: 72 });
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
  }, [city.defaultZoom, city.id, city.lat, city.lng, places]);

  useEffect(() => {
    markerElementsRef.current.forEach((element, placeId) => {
      element.dataset.active = placeId === selectedPlaceId ? "true" : "false";
    });

    const map = mapInstanceRef.current;
    const place = places.find((candidate) => candidate.id === selectedPlaceId);
    if (map && place) {
      map.easeTo({ center: [place.lng, place.lat], duration: 250 });
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
    <section className="grid overflow-hidden rounded-md border border-zinc-200 bg-white lg:grid-cols-[minmax(0,1fr)_380px]">
      <div
        aria-label={`Map of ${places.length} places in ${city.name}`}
        className="h-[520px] min-h-[420px] w-full bg-zinc-100 lg:h-[640px]"
        ref={mapContainerRef}
        role="img"
      />

      <aside className="flex min-h-0 flex-col border-t border-zinc-200 lg:border-l lg:border-t-0">
        <div className="border-b border-zinc-200 px-4 py-3">
          <p className="text-xs font-medium uppercase text-zinc-400">Map results</p>
          <p className="mt-1 text-sm font-semibold text-zinc-950">Select a marker or result</p>
        </div>

        <div className="max-h-[280px] overflow-auto border-b border-zinc-200 lg:max-h-[300px]" role="list">
          {places.map((place) => {
            const active = selectedPlace?.id === place.id;

            return (
              <button
                aria-current={active}
                className={`grid w-full gap-1 border-b border-zinc-200 px-4 py-3 text-left transition last:border-b-0 ${
                  active ? "bg-zinc-950 text-white" : "bg-white text-zinc-950 hover:bg-zinc-50"
                }`}
                key={place.id}
                onClick={() => setSelectedPlaceId(place.id)}
                type="button"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-semibold">{place.name}</span>
                  <span className={`rounded border px-2 py-0.5 text-xs font-medium ${active ? "border-white/20 text-white" : "border-zinc-200 text-zinc-500"}`}>
                    {place.type.icon}
                  </span>
                </span>
                <span className={`truncate text-sm ${active ? "text-zinc-300" : "text-zinc-500"}`}>
                  {formatPlacePriceForUnit(place, priceUnit)}
                </span>
                <span className={`truncate text-xs ${active ? "text-zinc-400" : "text-zinc-400"}`}>
                  Laptop: {place.laptopPolicy.availability}
                </span>
              </button>
            );
          })}
        </div>

        {selectedPlace ? (
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div>
              <span className="w-fit rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
                {selectedPlace.type.icon} {selectedPlace.type.label}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-zinc-950">{selectedPlace.name}</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-500">{selectedPlace.address}</p>
              <p className="mt-3 text-sm font-medium text-zinc-950">
                {formatPlacePriceForUnit(selectedPlace, priceUnit)}
              </p>
              <div className="mt-3 border-l-2 border-accent/40 pl-3">
                <p className="text-sm font-semibold text-zinc-950">Laptop: {selectedPlace.laptopPolicy.availability}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{selectedPlace.laptopPolicy.details}</p>
              </div>
              <p className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
                {selectedPlace.averageRating ? (
                  <>
                    <Star aria-hidden="true" className="h-4 w-4 fill-zinc-950 text-zinc-950" />
                    {selectedPlace.averageRating}
                  </>
                ) : (
                  "No reviews yet"
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-950">Offers</h3>
              {selectedPlace.offers.length ? (
                <ul className="mt-2 divide-y divide-zinc-200 rounded-md border border-zinc-200">
                  {selectedPlace.offers.slice(0, 4).map((offer) => (
                    <li className="flex items-center justify-between gap-4 px-3 py-2 text-sm" key={offer.id}>
                      <span className="text-zinc-600">{offer.label}</span>
                      <span className="font-medium text-zinc-950">{formatOfferPrice(offer, selectedPlace.priceCurrency)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-500">
                  No public offers captured yet.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-950"
                href={selectedPlace.websiteUrl}
                rel="noreferrer"
                target="_blank"
              >
                Website
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-950"
                href={getMapsUrl(selectedPlace)}
                rel="noreferrer"
                target="_blank"
              >
                Open in Maps
                <MapPin aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
