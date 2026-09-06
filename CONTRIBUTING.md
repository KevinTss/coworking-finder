# Contributing

Keep data edits boring and safe.

## IDs

- Use short lowercase slugs for `id` values, for example `mama-works-lyon`.
- Use `CityId`, `PlaceTypeId`, `TagId`, and `OfferUnit` constants from `src/lib/types.ts` for shared data values.
- Do not rename existing IDs unless you update every reference that points to them.
- Prefer appending places over reordering large sections.

## Relationships

- Data lives in `src/data/coworkingData.ts`.
- `places.cityId` must exist in `cities`.
- `places.typeId` must exist in `placeTypes`.
- `places.tagIds` must exist in `tags`.
- Keep `offers` and `reviews` nested under their place.

## Offers

Allowed `unit` values:

- `hour`
- `half_day`
- `day`
- `week`
- `month`

Do not invent monthly equivalents for cafes or formula-based pricing. Add multiple offers under the place instead.

## Freshness

Keep `config.lastUpdatedAt` as a human-readable `YYYY-MM-DD` date whenever the public dataset is refreshed.

Use `places.laptopPolicy.availability` for the quick schedule label, such as `Every day`, `Monday to Friday`, or a specific time window. Put caveats and source notes in `places.laptopPolicy.details` or `places.notes`.

## Before pushing

```bash
npm run validate
npm run build
```
