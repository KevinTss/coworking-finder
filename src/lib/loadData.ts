import { coworkingData } from "../data/coworkingData";

import { OfferUnit, type DataSet, type EnrichedPlace, type Offer, type Review, type Tag } from "./types";

export type PriceUnit = Extract<Offer["unit"], typeof OfferUnit.Hour | typeof OfferUnit.Day | typeof OfferUnit.Month>;

export const defaultPriceUnit: PriceUnit = OfferUnit.Day;

export const priceUnitOptions: Array<{ id: PriceUnit; label: string; shortLabel: string }> = [
  { id: OfferUnit.Hour, label: "Per hour", shortLabel: "Hour" },
  { id: OfferUnit.Day, label: "Per day", shortLabel: "Day" },
  { id: OfferUnit.Month, label: "Per month", shortLabel: "Month" }
];

function byId<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]));
}

function getAverageRating(placeReviews: Review[]) {
  const ratings = placeReviews
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number");

  if (!ratings.length) {
    return null;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Math.round((total / ratings.length) * 10) / 10;
}

function getCheapestOffer(placeOffers: Offer[]) {
  return [...placeOffers].sort((a, b) => a.price - b.price)[0] ?? null;
}

const cityRows = coworkingData.cities;
const placeTypeRows = coworkingData.placeTypes;
const placeRows = coworkingData.places;
const tagRows = coworkingData.tags;
const config = coworkingData.config;

const citiesById = byId(cityRows);
const typesById = byId(placeTypeRows);
const tagsById = byId(tagRows);

const enrichedPlaces: EnrichedPlace[] = placeRows.map((place) => {
  const city = citiesById.get(place.cityId);
  const type = typesById.get(place.typeId);

  if (!city || !type) {
    throw new Error(`Invalid data relationship for place "${place.id}"`);
  }

  const placeTagRows = place.tagIds
    .map((tagId) => tagsById.get(tagId))
    .filter((tag): tag is Tag => Boolean(tag));
  const cheapestOffer = getCheapestOffer(place.offers);

  return {
    ...place,
    city,
    type,
    tags: placeTagRows,
    averageRating: getAverageRating(place.reviews),
    cheapestOffer
  };
});

const dataSet: DataSet = {
  cities: cityRows,
  placeTypes: placeTypeRows,
  places: enrichedPlaces,
  tags: tagRows,
  config
};

export function getData() {
  return dataSet;
}

export function formatCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    currency,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    style: "currency"
  }).format(value);
}

export function formatLastUpdatedAt(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function formatOfferUnit(unit: Offer["unit"]) {
  const units: Record<Offer["unit"], string> = {
    [OfferUnit.Hour]: "/h",
    [OfferUnit.HalfDay]: "/half-day",
    [OfferUnit.Day]: "/day",
    [OfferUnit.Week]: "/week",
    [OfferUnit.Month]: "/month"
  };

  return units[unit];
}

export function formatOfferPrice(offer: Offer, currency = "EUR") {
  return `${formatCurrency(offer.price, currency)} ${formatOfferUnit(offer.unit)}`;
}

export function getOfferForUnit(place: EnrichedPlace, unit: PriceUnit) {
  return [...place.offers].filter((offer) => offer.unit === unit).sort((a, b) => a.price - b.price)[0] ?? null;
}

export function getPlacePriceForUnit(place: EnrichedPlace, unit: PriceUnit) {
  const offer = getOfferForUnit(place, unit);

  if (offer) {
    return offer.price;
  }

  if (unit === OfferUnit.Month && typeof place.priceMonthlyEstimate === "number") {
    return place.priceMonthlyEstimate;
  }

  return null;
}

export function formatPlacePriceForUnit(place: EnrichedPlace, unit: PriceUnit) {
  const offer = getOfferForUnit(place, unit);

  if (offer) {
    return formatOfferPrice(offer, place.priceCurrency);
  }

  if (unit === OfferUnit.Month && typeof place.priceMonthlyEstimate === "number") {
    return `${formatCurrency(place.priceMonthlyEstimate, place.priceCurrency)} /month`;
  }

  const missingLabels: Record<PriceUnit, string> = {
    day: "No day price",
    hour: "No hourly price",
    month: "No monthly price"
  };

  return missingLabels[unit];
}

export function formatPlacePrice(place: EnrichedPlace) {
  if (place.cheapestOffer) {
    return `From ${formatOfferPrice(place.cheapestOffer, place.priceCurrency)}`;
  }

  if (typeof place.priceMonthlyEstimate === "number") {
    return `From ${formatCurrency(place.priceMonthlyEstimate, place.priceCurrency)} /month`;
  }

  return "Price not listed";
}
