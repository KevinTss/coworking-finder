import { ExternalLink, MapPin } from "lucide-react";

import { formatOfferPrice } from "../lib/loadData";
import { getMapsUrl } from "../lib/maps";
import type { EnrichedPlace } from "../lib/types";
import { MapEmbed } from "./MapEmbed";

interface PlaceDetailProps {
  place: EnrichedPlace;
}

export function PlaceDetail({ place }: PlaceDetailProps) {
  return (
    <div className="grid gap-5 border-t border-zinc-200 bg-zinc-50 px-4 py-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)]">
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex flex-wrap gap-2">
            {place.tags.map((tag) => (
              <span className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-600" key={tag.id}>
                {tag.label}
              </span>
            ))}
          </div>
          {place.notes ? <p className="mt-3 text-sm leading-6 text-zinc-600">{place.notes}</p> : null}
        </div>

        <section aria-labelledby={`${place.id}-offers`}>
          <h3 className="text-sm font-semibold text-zinc-950" id={`${place.id}-offers`}>
            Offers
          </h3>
          {place.offers.length ? (
            <ul className="mt-2 divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white">
              {place.offers.map((offer) => (
                <li className="flex items-center justify-between gap-4 px-3 py-2 text-sm" key={offer.id}>
                  <span className="text-zinc-600">{offer.label}</span>
                  <span className="font-medium text-zinc-950">{formatOfferPrice(offer, place.price_currency)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500">
              No public offers captured yet.
            </p>
          )}
        </section>

        <section aria-labelledby={`${place.id}-reviews`}>
          <h3 className="text-sm font-semibold text-zinc-950" id={`${place.id}-reviews`}>
            Tested by
          </h3>
          {place.reviews.length ? (
            <ul className="mt-2 space-y-2">
              {place.reviews.map((review) => (
                <li className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" key={review.id}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-zinc-950">{review.tester_name}</span>
                    <span className="text-zinc-500">{review.rating ? `${review.rating}/5` : review.date}</span>
                  </div>
                  <p className="mt-1 leading-6 text-zinc-600">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500">
              No tested-by review yet.
            </p>
          )}
        </section>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <MapEmbed lat={place.lat} lng={place.lng} name={place.name} zoom={15} />
        <div className="flex flex-wrap gap-2">
          <a
            className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-950"
            href={place.website_url}
            rel="noreferrer"
            target="_blank"
          >
            Website
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-950"
            href={getMapsUrl(place)}
            rel="noreferrer"
            target="_blank"
          >
            Open in Maps
            <MapPin aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
