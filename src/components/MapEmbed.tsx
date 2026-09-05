import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";

import { osmRasterStyle } from "../lib/maps";

interface MapEmbedProps {
  lat: number;
  lng: number;
  name: string;
  zoom: number;
}

export function MapEmbed({ lat, lng, name, zoom }: MapEmbedProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | null = null;

    async function mountMap() {
      const maplibregl = await import("maplibre-gl");

      if (cancelled || !mapRef.current) {
        return;
      }

      map = new maplibregl.Map({
        attributionControl: false,
        center: [lng, lat],
        container: mapRef.current,
        interactive: true,
        style: osmRasterStyle,
        zoom
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
      new maplibregl.Marker({ color: "#18181b" }).setLngLat([lng, lat]).addTo(map);
    }

    void mountMap();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng, zoom]);

  return (
    <div className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
      <div
        aria-label={`Map centered on ${name}`}
        className="h-[280px] w-full"
        ref={mapRef}
        role="img"
      />
    </div>
  );
}
