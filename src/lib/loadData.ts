import cities from "../../data/cities.json";
import offers from "../../data/offers.json";
import placeTags from "../../data/place_tags.json";
import placeTypes from "../../data/place_types.json";
import places from "../../data/places.json";
import reviews from "../../data/reviews.json";
import siteConfig from "../../data/site_config.json";
import tags from "../../data/tags.json";

import type { City, DataSet, EnrichedPlace, Offer, Place, PlaceTag, PlaceType, Review, SiteConfig, Tag } from "./types";

function byId<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]));
}

function groupBy<T>(rows: T[], getKey: (row: T) => string) {
  return rows.reduce<Map<string, T[]>>((groups, row) => {
    const key = getKey(row);
    groups.set(key, [...(groups.get(key) ?? []), row]);
    return groups;
  }, new Map());
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

const cityRows = cities as City[];
const placeTypeRows = placeTypes as PlaceType[];
const placeRows = places as Place[];
const offerRows = offers as Offer[];
const tagRows = tags as Tag[];
const placeTagRows = placeTags as PlaceTag[];
const reviewRows = reviews as Review[];
const config = siteConfig as SiteConfig;

const citiesById = byId(cityRows);
const typesById = byId(placeTypeRows);
const tagsById = byId(tagRows);
const offersByPlace = groupBy(offerRows, (offer) => offer.place_id);
const reviewsByPlace = groupBy(reviewRows, (review) => review.place_id);
const tagIdsByPlace = groupBy(placeTagRows, (placeTag) => placeTag.place_id);

const enrichedPlaces: EnrichedPlace[] = placeRows.map((place) => {
  const city = citiesById.get(place.city_id);
  const type = typesById.get(place.type_id);

  if (!city || !type) {
    throw new Error(`Invalid data relationship for place "${place.id}"`);
  }

  const placeOffers = offersByPlace.get(place.id) ?? [];
  const placeReviews = reviewsByPlace.get(place.id) ?? [];
  const placeTagIds = tagIdsByPlace.get(place.id) ?? [];
  const placeTagRows = placeTagIds
    .map((placeTag) => tagsById.get(placeTag.tag_id))
    .filter((tag): tag is Tag => Boolean(tag));
  const cheapestOffer = getCheapestOffer(placeOffers);

  return {
    ...place,
    city,
    type,
    offers: placeOffers,
    reviews: placeReviews,
    tags: placeTagRows,
    averageRating: getAverageRating(placeReviews),
    cheapestOffer,
    priceForFilter: cheapestOffer?.price ?? place.price_monthly_estimate
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

export function formatOfferUnit(unit: Offer["unit"]) {
  const units: Record<Offer["unit"], string> = {
    hour: "/h",
    half_day: "/half-day",
    day: "/day",
    week: "/week",
    month: "/month"
  };

  return units[unit];
}

export function formatOfferPrice(offer: Offer, currency = "EUR") {
  return `${formatCurrency(offer.price, currency)} ${formatOfferUnit(offer.unit)}`;
}

export function formatPlacePrice(place: EnrichedPlace) {
  if (place.cheapestOffer) {
    return `From ${formatOfferPrice(place.cheapestOffer, place.price_currency)}`;
  }

  if (typeof place.price_monthly_estimate === "number") {
    return `From ${formatCurrency(place.price_monthly_estimate, place.price_currency)} /month`;
  }

  return "Price not listed";
}
