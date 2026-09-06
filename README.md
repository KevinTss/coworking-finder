# Coworking Finder

A static React directory for coworking spaces and coworking-friendly cafes. Data lives in one typed catalog at `src/data/coworkingData.ts`, and GitHub Pages publishes the site after every push to `main`.

## Local development

```bash
npm install
npm run validate
npm run dev
```

## Data model

The repo uses a single no-SQL-style TypeScript object:

- `config`, `cities`, `placeTypes`, and `tags` define shared app data.
- `places` is the main collection.
- Each place owns its own `offers`, `reviews`, `tagIds`, and `laptopPolicy`.

Constants for IDs and offer units live in `src/lib/types.ts`, so data edits can use `CityId`, `PlaceTypeId`, `TagId`, and `OfferUnit` instead of loose strings.

Average ratings are computed from nested reviews. Prices are listed as nested offers, and `priceMonthlyEstimate` stays `null` unless a venue publishes a concrete monthly rate.

`config.lastUpdatedAt` stays as `YYYY-MM-DD` so the UI can render a friendly updated date.

## Deployment

The workflow in `.github/workflows/deploy.yml` runs:

```bash
npm ci
npm run validate
npm run build
```

Then it uploads `dist/` with the official GitHub Pages actions. The app uses `/:citySlug` routes and includes a `404.html` fallback for direct links such as `/lyon`.
