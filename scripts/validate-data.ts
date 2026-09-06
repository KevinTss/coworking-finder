import { coworkingData } from "../src/data/coworkingData";
import { OfferUnit, type CoworkingData, type Offer, type Place, type Review } from "../src/lib/types";

const errors: string[] = [];
const allowedOfferUnits = new Set<string>(Object.values(OfferUnit));

function report(message: string) {
  errors.push(message);
}

function collectIds(name: string, rows: Array<{ id: string }>) {
  const ids = new Set<string>();

  rows.forEach((row, index) => {
    if (!row.id.trim()) {
      report(`${name}[${index}].id must be a non-empty string`);
      return;
    }

    if (ids.has(row.id)) {
      report(`${name} has duplicate id "${row.id}"`);
    }

    ids.add(row.id);
  });

  return ids;
}

function expectReference(value: string, allowedIds: Set<string>, context: string) {
  if (!allowedIds.has(value)) {
    report(`${context} references unknown id "${value}"`);
  }
}

function validateUrl(value: string, context: string) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      report(`${context} must use http or https`);
    }
  } catch {
    report(`${context} must be a valid URL`);
  }
}

function validateDate(value: string, context: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    report(`${context} must use YYYY-MM-DD`);
  }
}

function validatePrice(value: number | null, context: string) {
  if (value !== null && value < 0) {
    report(`${context} must be a non-negative number or null`);
  }
}

function validateOffer(offer: Offer, context: string) {
  if (!offer.label.trim()) {
    report(`${context}.label must be a non-empty string`);
  }

  if (offer.price < 0) {
    report(`${context}.price must be non-negative`);
  }

  if (!allowedOfferUnits.has(offer.unit)) {
    report(`${context}.unit must be one of ${[...allowedOfferUnits].join(", ")}`);
  }
}

function validateReview(review: Review, context: string) {
  if (!review.testerName.trim()) {
    report(`${context}.testerName must be a non-empty string`);
  }

  if (review.testerLink) {
    validateUrl(review.testerLink, `${context}.testerLink`);
  }

  if (!review.comment.trim()) {
    report(`${context}.comment must be a non-empty string`);
  }

  validateDate(review.date, `${context}.date`);

  if (
    review.rating !== null &&
    (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5)
  ) {
    report(`${context}.rating must be an integer from 1 to 5 or null`);
  }
}

function validatePlace(place: Place, index: number, ids: { cityIds: Set<string>; typeIds: Set<string>; tagIds: Set<string> }) {
  const context = `places[${index}]`;

  expectReference(place.cityId, ids.cityIds, `${context}.cityId`);
  expectReference(place.typeId, ids.typeIds, `${context}.typeId`);

  if (!place.name.trim()) {
    report(`${context}.name must be a non-empty string`);
  }

  if (!place.address.trim()) {
    report(`${context}.address must be a non-empty string`);
  }

  if (Number.isNaN(place.lat) || Number.isNaN(place.lng)) {
    report(`${context}.lat and ${context}.lng must be numbers`);
  }

  validateUrl(place.websiteUrl, `${context}.websiteUrl`);
  validatePrice(place.priceMonthlyEstimate, `${context}.priceMonthlyEstimate`);

  if (!place.priceCurrency.trim()) {
    report(`${context}.priceCurrency must be a non-empty string`);
  }

  if (!place.laptopPolicy.availability.trim()) {
    report(`${context}.laptopPolicy.availability must be a non-empty string`);
  }

  if (!place.laptopPolicy.details.trim()) {
    report(`${context}.laptopPolicy.details must be a non-empty string`);
  }

  const seenTagIds = new Set<string>();
  place.tagIds.forEach((tagId) => {
    expectReference(tagId, ids.tagIds, `${context}.tagIds`);

    if (seenTagIds.has(tagId)) {
      report(`${context}.tagIds duplicates tag "${tagId}"`);
    }

    seenTagIds.add(tagId);
  });

  place.offers.forEach((offer, offerIndex) => validateOffer(offer, `${context}.offers[${offerIndex}]`));
  place.reviews.forEach((review, reviewIndex) => validateReview(review, `${context}.reviews[${reviewIndex}]`));
}

function validateData(data: CoworkingData) {
  const cityIds = collectIds("cities", data.cities);
  const typeIds = collectIds("placeTypes", data.placeTypes);
  const tagIds = collectIds("tags", data.tags);
  const placeIds = collectIds("places", data.places);
  const offerIds = collectIds(
    "offers",
    data.places.flatMap((place) => place.offers)
  );
  const reviewIds = collectIds(
    "reviews",
    data.places.flatMap((place) => place.reviews)
  );

  expectReference(data.config.defaultCity, cityIds, "config.defaultCity");
  validateDate(data.config.lastUpdatedAt, "config.lastUpdatedAt");
  validateUrl(data.config.author.linkedinUrl, "config.author.linkedinUrl");
  validateUrl(data.config.author.githubUrl, "config.author.githubUrl");

  data.cities.forEach((city, index) => {
    if (!city.name.trim()) {
      report(`cities[${index}].name must be a non-empty string`);
    }

    if (!city.country.trim()) {
      report(`cities[${index}].country must be a non-empty string`);
    }

    if (Number.isNaN(city.lat) || Number.isNaN(city.lng) || Number.isNaN(city.defaultZoom)) {
      report(`cities[${index}] coordinates and defaultZoom must be numbers`);
    }
  });

  data.placeTypes.forEach((type, index) => {
    if (!type.label.trim()) {
      report(`placeTypes[${index}].label must be a non-empty string`);
    }

    if (!type.icon.trim()) {
      report(`placeTypes[${index}].icon must be a non-empty string`);
    }
  });

  data.tags.forEach((tag, index) => {
    if (!tag.label.trim()) {
      report(`tags[${index}].label must be a non-empty string`);
    }
  });

  data.places.forEach((place, index) => validatePlace(place, index, { cityIds, typeIds, tagIds }));

  if (offerIds.size !== data.places.flatMap((place) => place.offers).length) {
    report("offers must have globally unique ids");
  }

  if (reviewIds.size !== data.places.flatMap((place) => place.reviews).length) {
    report("reviews must have globally unique ids");
  }

  if (placeIds.size !== data.places.length) {
    report("places must have globally unique ids");
  }
}

validateData(coworkingData);

if (errors.length) {
  console.error("Data validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Data validation passed.");
