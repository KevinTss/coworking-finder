import { ChevronDown, ExternalLink, Star } from "lucide-react";

import { formatPlacePriceForUnit, type PriceUnit } from "../lib/loadData";
import type { EnrichedPlace } from "../lib/types";
import { PlaceDetail } from "./PlaceDetail";

interface PlaceRowProps {
  isOpen: boolean;
  onToggle: () => void;
  place: EnrichedPlace;
  priceUnit: PriceUnit;
}

function getZone(address: string) {
  const postalCode = address.match(/69\d{3}/)?.[0];

  if (!postalCode) {
    return "Lyon";
  }

  if (postalCode === "69100") {
    return "Villeurbanne";
  }

  return `Lyon ${Number(postalCode.slice(-2))}`;
}

export function PlaceRow({ isOpen, onToggle, place, priceUnit }: PlaceRowProps) {
  const typeTone =
    place.type.id === "cafe"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-teal-200 bg-teal-50 text-teal-800";

  return (
    <article className="border-b border-zinc-200 last:border-b-0" role="listitem">
      <button
        aria-expanded={isOpen}
        className="grid w-full gap-3 px-4 py-4 text-left transition hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none md:grid-cols-[minmax(0,1.35fr)_150px_130px_110px_90px_36px] md:items-center md:gap-4"
        onClick={onToggle}
        type="button"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-zinc-950">{place.name}</span>
          <span className="mt-1 block truncate text-sm text-zinc-500">{place.address}</span>
        </span>

        <span className={`w-fit rounded border px-2 py-1 text-xs font-medium ${typeTone}`}>
          {place.type.icon} {place.type.label}
        </span>

        <span className="text-sm text-zinc-600">{getZone(place.address)}</span>

        <span className="text-sm font-medium text-zinc-900">{formatPlacePriceForUnit(place, priceUnit)}</span>

        <span className="flex items-center gap-2 text-sm text-zinc-600">
          {place.averageRating ? (
            <>
              <Star aria-hidden="true" className="h-4 w-4 fill-zinc-950 text-zinc-950" />
              {place.averageRating}
            </>
          ) : (
            "No reviews"
          )}
        </span>

        <span className="flex items-center justify-between gap-2 md:justify-end">
          <span className="flex gap-1 text-zinc-400">
            {place.websiteUrl ? <ExternalLink aria-label="Has website" className="h-4 w-4" /> : null}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 text-zinc-500 transition ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {isOpen ? <PlaceDetail place={place} /> : null}
    </article>
  );
}
