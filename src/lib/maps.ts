import type { StyleSpecification } from "maplibre-gl";

import type { EnrichedPlace } from "./types";

export const osmRasterStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors"
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm"
    }
  ]
};

export function getMapsUrl(place: EnrichedPlace) {
  return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
}
