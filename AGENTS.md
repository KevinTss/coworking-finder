# Agent Notes

This repo is append-friendly on purpose. Edit the typed catalog in `src/data/coworkingData.ts` and run `npm run validate` before opening a PR or pushing.

- Keep IDs stable.
- Add prices as nested `offers` under the relevant place.
- Leave `priceMonthlyEstimate` as `null` unless the venue publishes a clear monthly rate.
- Use shared constants from `src/lib/types.ts` for city IDs, place types, tags, and offer units.
- Add testimonials only when they are real first-party "tested by" notes.
- Never store computed average ratings; the app computes them while loading data.
