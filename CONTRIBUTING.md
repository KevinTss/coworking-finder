# Contributing

Keep data edits boring and safe.

## IDs

- Use short lowercase slugs for `id` values, for example `mama-works-lyon`.
- Do not rename existing IDs unless you update every foreign key that points to them.
- Prefer appending rows over reordering large files.

## Relationships

- `places.city_id` must exist in `cities.json`.
- `places.type_id` must exist in `place_types.json`.
- `offers.place_id` and `reviews.place_id` must exist in `places.json`.
- `place_tags.place_id` must exist in `places.json`.
- `place_tags.tag_id` must exist in `tags.json`.

## Offers

Allowed `unit` values:

- `hour`
- `half_day`
- `day`
- `week`
- `month`

Do not invent monthly equivalents for cafes or formula-based pricing. Add multiple rows to `offers.json` instead.

## Before pushing

```bash
npm run validate
npm run build
```
