import { useEffect, useState } from "react";

import type { PriceUnit } from "../lib/loadData";
import type { EnrichedPlace } from "../lib/types";
import { PlaceRow } from "./PlaceRow";

interface PlaceListProps {
  places: EnrichedPlace[];
  priceUnit: PriceUnit;
}

export function PlaceList({ places, priceUnit }: PlaceListProps) {
  const [openPlaceId, setOpenPlaceId] = useState<string | null>(null);

  useEffect(() => {
    if (!places.length) {
      setOpenPlaceId(null);
      return;
    }

    if (openPlaceId && !places.some((place) => place.id === openPlaceId)) {
      setOpenPlaceId(null);
    }
  }, [openPlaceId, places]);

  if (!places.length) {
    return (
      <div className="rounded-md border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
        <h2 className="text-lg font-semibold text-zinc-950">No matching places</h2>
        <p className="mt-2 text-sm text-zinc-500">Try adjusting the filters.</p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-md border border-zinc-200 bg-white" aria-label="Places">
      <div className="hidden grid-cols-[minmax(0,1.35fr)_150px_130px_110px_90px_36px] gap-4 border-b border-zinc-200 bg-zinc-100/70 px-4 py-2 text-xs font-medium uppercase text-zinc-500 md:grid">
        <span>Place</span>
        <span>Type</span>
        <span>Zone</span>
        <span>Price</span>
        <span>Rating</span>
        <span />
      </div>
      <div role="list">
        {places.map((place) => (
          <PlaceRow
            isOpen={openPlaceId === place.id}
            key={place.id}
            onToggle={() => setOpenPlaceId((current) => (current === place.id ? null : place.id))}
            place={place}
            priceUnit={priceUnit}
          />
        ))}
      </div>
    </section>
  );
}
