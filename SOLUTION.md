# Reference solution (mid-level)

What a good candidate can finish in 30–40 minutes: **electronics + shoes + a fallback**, with a design that makes the next type easy.
Books and groceries are deliberately not built; they fall back like unknown types.

Compare it with the candidate's starting point: `git diff catalog catalog-solution -- src`.

## The approach in one sentence

A **discriminated union** models the data, a **registry** maps each product type to its own component, and the card renders whatever the registry returns with `NgComponentOutlet`, so the card never changes when a type is added.

## Files

| File | What it shows |
|---|---|
| `catalog/product.model.ts` | `type` is the discriminator; each known type has its own `details` shape. `UnknownProduct` covers types the API sends that the app doesn't know. |
| `catalog/details/details-registry.ts` | Type → component map + fallback. Adding a type = one component + one line. |
| `catalog/details/electronics-details.ts` | Chip info + battery options as a radio group. Picking one updates the card's price. Starts on the option with no extra cost. |
| `catalog/details/shoe-details.ts` | Size picker as a radio group; out-of-stock sizes disabled and announced; "Wide fit" badge; color swatches. |
| `catalog/details/fallback-details.ts` | Renders nothing for unknown / not-yet-built types; the shared card stays intact. |
| `catalog/product-card-state.ts` | Per-card state (`priceDelta`) shared by the card and its details component. |
| `catalog/product-card.*` | Looks up the component, passes `product` as an input, shows `price + priceDelta`. |

## Decisions worth hearing from a candidate

1. **Why a union, not `any`:** after checking `type`, TypeScript knows the exact `details` shape, so mistakes show up at compile time.
2. **Why a registry, not `@switch` in the card:** every team shares the card, so a new type shouldn't mean editing it. `@switch` is fine for 2–3 types and an honest first step.
3. **Two different "unknown" problems:** *compile time* (a known type has no component yet → drop `Partial` from the registry and the build fails) vs. *runtime* (the API sends a new type → fallback). Both are handled here.
4. **How the price updates:** `NgComponentOutlet` supports inputs but **not outputs**, so the details component can't emit to the card. A per-card service (`providers: [ProductCardState]` on the card) is visible to the component created inside it. Alternatives a candidate might pick: pass a signal or callback as an input; `ViewContainerRef.createComponent` and subscribe to the output; or keep `@switch` with normal components and a normal `(output)` binding.
5. **The product is never mutated:** the shown price is computed (`price + priceDelta`).
6. **Chips are radio groups:** `role="radiogroup"` / `role="radio"` + `aria-checked`, and out-of-stock sizes are `disabled` with an "out of stock" label.

## What this solution does NOT do (senior extras to probe)

- **Add to cart ignores the selection.** A shoe can be added with no size. Ask: "The size must go into the cart. Where should selection state live?" (Move it into `ProductCardState`, and make Add to cart require it.)
- **No data validation** at the API boundary; the service casts the JSON. A senior might add a type guard or schema per type.
- **No lazy loading** of the type components (`import()` in the registry, or `@defer`).
- **Books and groceries aren't built.** Adding one is the quickest way to show the design works: write `BookDetailsComponent`, add `book: BookDetailsComponent` to the registry.
- **Furniture** (from the interviewer tools) falls back. Same exercise as above.
- **The size picker isn't keyboard-optimal:** each chip is a tab stop. A full radio group uses arrow keys (or native `<input type="radio">`).

## Checked in a browser

- Phone: 4,500 mAh selected by default, $649 → pick 5,200 mAh → **$709**.
- Power bank: 10,000 mAh → **$34**; 26,800 mAh → **$74**. Other cards unaffected.
- Shoes: size 41 disabled; picking 42 selects it.
- Furniture + gift card switched on: 15 cards; books, groceries, furniture and the gift card fall back; no console errors.
