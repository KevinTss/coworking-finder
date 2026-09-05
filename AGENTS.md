# Agent Notes

This repo is append-friendly on purpose. Edit the JSON tables directly and run `npm run validate` before opening a PR or pushing.

- Keep IDs stable.
- Add prices as rows in `data/offers.json`.
- Leave `price_monthly_estimate` as `null` unless the venue publishes a clear monthly rate.
- Add testimonials only when they are real first-party "tested by" notes.
- Never store computed average ratings; the app computes them while loading data.
