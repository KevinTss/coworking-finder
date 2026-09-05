# Coworking Finder

A static React directory for coworking spaces and coworking-friendly cafes. Data lives in normalized JSON tables under `data/`, and GitHub Pages publishes the site after every push to `main`.

## Local development

```bash
npm install
npm run validate
npm run dev
```

## Data model

The repo uses flat JSON tables with stable IDs and foreign keys:

- `data/cities.json`
- `data/place_types.json`
- `data/places.json`
- `data/offers.json`
- `data/tags.json`
- `data/place_tags.json`
- `data/reviews.json`
- `data/site_config.json`

Average ratings are computed from `reviews.json`. Prices are listed as offers, and `price_monthly_estimate` stays `null` unless a venue publishes a concrete monthly rate.

## Deployment

The workflow in `.github/workflows/deploy.yml` runs:

```bash
npm ci
npm run validate
npm run build
```

Then it uploads `dist/` with the official GitHub Pages actions. The app uses `/:citySlug` routes and includes a `404.html` fallback for direct links such as `/lyon`.
