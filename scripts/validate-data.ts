import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
const allowedOfferUnits = new Set(["hour", "half_day", "day", "week", "month"]);

type Row = Record<string, unknown>;

interface Tables {
  cities: Row[];
  placeTypes: Row[];
  places: Row[];
  offers: Row[];
  tags: Row[];
  placeTags: Row[];
  reviews: Row[];
  config: Row;
}

const errors: string[] = [];

async function readJson<T>(fileName: string): Promise<T> {
  const text = await readFile(path.join(dataDir, fileName), "utf8");
  return JSON.parse(text) as T;
}

function isObject(value: unknown): value is Row {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function expectArray(name: string, value: unknown): Row[] {
  if (!Array.isArray(value)) {
    errors.push(`${name} must be an array`);
    return [];
  }

  return value.filter((row, index): row is Row => {
    if (!isObject(row)) {
      errors.push(`${name}[${index}] must be an object`);
      return false;
    }

    return true;
  });
}

function expectString(row: Row, field: string, context: string) {
  if (typeof row[field] !== "string" || !String(row[field]).trim()) {
    errors.push(`${context}.${field} must be a non-empty string`);
    return "";
  }

  return String(row[field]);
}

function expectNullableString(row: Row, field: string, context: string) {
  if (row[field] !== null && typeof row[field] !== "string") {
    errors.push(`${context}.${field} must be a string or null`);
  }
}

function expectNumber(row: Row, field: string, context: string) {
  if (typeof row[field] !== "number" || Number.isNaN(row[field])) {
    errors.push(`${context}.${field} must be a number`);
    return null;
  }

  return Number(row[field]);
}

function expectNullableNonNegativeNumber(row: Row, field: string, context: string) {
  if (row[field] === null) {
    return;
  }

  if (typeof row[field] !== "number" || Number(row[field]) < 0) {
    errors.push(`${context}.${field} must be a non-negative number or null`);
  }
}

function expectUrl(row: Row, field: string, context: string) {
  const value = expectString(row, field, context);

  if (!value) {
    return;
  }

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      errors.push(`${context}.${field} must use http or https`);
    }
  } catch {
    errors.push(`${context}.${field} must be a valid URL`);
  }
}

function collectIds(name: string, rows: Row[]) {
  const ids = new Set<string>();

  rows.forEach((row, index) => {
    const id = expectString(row, "id", `${name}[${index}]`);
    if (!id) {
      return;
    }

    if (ids.has(id)) {
      errors.push(`${name} has duplicate id "${id}"`);
    }

    ids.add(id);
  });

  return ids;
}

function expectReference(value: unknown, allowedIds: Set<string>, context: string) {
  if (typeof value !== "string" || !allowedIds.has(value)) {
    errors.push(`${context} references unknown id "${String(value)}"`);
  }
}

function validateTables(tables: Tables) {
  const cityIds = collectIds("cities", tables.cities);
  const typeIds = collectIds("place_types", tables.placeTypes);
  const placeIds = collectIds("places", tables.places);
  const tagIds = collectIds("tags", tables.tags);
  collectIds("offers", tables.offers);
  collectIds("reviews", tables.reviews);

  tables.cities.forEach((city, index) => {
    const context = `cities[${index}]`;
    expectString(city, "name", context);
    expectString(city, "country", context);
    expectNumber(city, "lat", context);
    expectNumber(city, "lng", context);
    expectNumber(city, "default_zoom", context);
  });

  tables.placeTypes.forEach((type, index) => {
    const context = `place_types[${index}]`;
    expectString(type, "label", context);
    expectString(type, "icon", context);
  });

  tables.places.forEach((place, index) => {
    const context = `places[${index}]`;
    expectReference(place.city_id, cityIds, `${context}.city_id`);
    expectReference(place.type_id, typeIds, `${context}.type_id`);
    expectString(place, "name", context);
    expectString(place, "address", context);
    expectNumber(place, "lat", context);
    expectNumber(place, "lng", context);
    expectUrl(place, "website_url", context);
    expectNullableNonNegativeNumber(place, "price_monthly_estimate", context);
    expectString(place, "price_currency", context);
    expectNullableString(place, "notes", context);
  });

  tables.offers.forEach((offer, index) => {
    const context = `offers[${index}]`;
    expectReference(offer.place_id, placeIds, `${context}.place_id`);
    expectString(offer, "label", context);
    const price = expectNumber(offer, "price", context);
    if (typeof price === "number" && price < 0) {
      errors.push(`${context}.price must be non-negative`);
    }

    if (typeof offer.unit !== "string" || !allowedOfferUnits.has(offer.unit)) {
      errors.push(`${context}.unit must be one of ${[...allowedOfferUnits].join(", ")}`);
    }
  });

  tables.tags.forEach((tag, index) => {
    expectString(tag, "label", `tags[${index}]`);
  });

  const seenPlaceTags = new Set<string>();
  tables.placeTags.forEach((placeTag, index) => {
    const context = `place_tags[${index}]`;
    expectReference(placeTag.place_id, placeIds, `${context}.place_id`);
    expectReference(placeTag.tag_id, tagIds, `${context}.tag_id`);

    const key = `${String(placeTag.place_id)}:${String(placeTag.tag_id)}`;
    if (seenPlaceTags.has(key)) {
      errors.push(`${context} duplicates place/tag pair "${key}"`);
    }
    seenPlaceTags.add(key);
  });

  tables.reviews.forEach((review, index) => {
    const context = `reviews[${index}]`;
    expectReference(review.place_id, placeIds, `${context}.place_id`);
    expectString(review, "tester_name", context);
    expectNullableString(review, "tester_link", context);
    expectString(review, "comment", context);
    const date = expectString(review, "date", context);

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`${context}.date must use YYYY-MM-DD`);
    }

    if (
      review.rating !== null &&
      (typeof review.rating !== "number" || !Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5)
    ) {
      errors.push(`${context}.rating must be an integer from 1 to 5 or null`);
    }
  });

  expectString(tables.config, "site_title", "site_config");
  expectReference(tables.config.default_city, cityIds, "site_config.default_city");

  if (!isObject(tables.config.author)) {
    errors.push("site_config.author must be an object");
  } else {
    expectString(tables.config.author, "name", "site_config.author");
    expectUrl(tables.config.author, "linkedin_url", "site_config.author");
    expectUrl(tables.config.author, "github_url", "site_config.author");
  }
}

async function main() {
  const tables: Tables = {
    cities: expectArray("cities.json", await readJson("cities.json")),
    placeTypes: expectArray("place_types.json", await readJson("place_types.json")),
    places: expectArray("places.json", await readJson("places.json")),
    offers: expectArray("offers.json", await readJson("offers.json")),
    tags: expectArray("tags.json", await readJson("tags.json")),
    placeTags: expectArray("place_tags.json", await readJson("place_tags.json")),
    reviews: expectArray("reviews.json", await readJson("reviews.json")),
    config: await readJson("site_config.json")
  };

  if (!isObject(tables.config)) {
    errors.push("site_config.json must be an object");
    tables.config = {};
  }

  validateTables(tables);

  if (errors.length) {
    console.error("Data validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Data validation passed.");
}

void main();
