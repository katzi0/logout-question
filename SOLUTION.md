# Reference solution (React, mid-level)

What a good candidate can finish in 30–40 minutes: **electronics + shoes + a fallback**, with a design that makes the next type easy.
Books and groceries are deliberately not built; they fall back like unknown types.

Compare it with the candidate's starting point: `git diff catalog-react catalog-react-solution -- src`.

## The approach in one sentence

A **discriminated union** models the data, a **registry** maps each product type to its own component, and the card renders whatever the registry returns, so the card never changes when a type is added.

## Files

| File | What it shows |
|---|---|
| `catalog/product.model.ts` | `type` is the discriminator; each known type has its own `details` shape. `UnknownProduct` covers types the API sends that the app doesn't know. |
| `catalog/details/details-registry.ts` | Type → component map + fallback. Adding a type = one component + one line. |
| `catalog/details/types.ts` | `DetailsProps`: the one props shape every details component accepts (`product` + `onPriceDeltaChange`). |
| `catalog/details/ElectronicsDetails.tsx` | Chip info + battery options as a radio group. Picking one calls `onPriceDeltaChange`. Starts on the option with no extra cost. |
| `catalog/details/ShoeDetails.tsx` | Size picker as a radio group; out-of-stock sizes disabled and announced; "Wide fit" badge; color swatches. |
| `catalog/details/FallbackDetails.tsx` | Renders nothing for unknown / not-yet-built types; the shared card stays intact. |
| `catalog/ProductCard.tsx` | Looks up the component, holds `priceDelta` state, shows `price + priceDelta`. |

## Decisions worth hearing from a candidate

1. **Why a union, not `any`:** after checking `type`, TypeScript knows the exact `details` shape, so mistakes show up at compile time.
2. **Why a registry, not a `switch` in the card:** every team shares the card, so a new type shouldn't mean editing it. A `switch` is fine for 2–3 types and an honest first step.
3. **Two different "unknown" problems:** *compile time* (a known type has no component yet → drop `Partial` from the registry and the build fails) vs. *runtime* (the API sends a new type → fallback). Both are handled here.
4. **How the price updates:** the card owns `priceDelta` in `useState` and passes a callback down. In React this is simple: callback props work the same for a component picked from a map. (The Angular version needs a per-card service, because `NgComponentOutlet` has no outputs.)
5. **One props shape for every details component.** That's what lets the card render any of them the same way. Components that each want different props break the registry.
6. **The product is never mutated:** the shown price is computed (`price + priceDelta`).
7. **Chips are radio groups:** `role="radiogroup"` / `role="radio"` + `aria-checked`, and out-of-stock sizes are `disabled` with an "out of stock" label.

## React-specific things to watch for

- **`key={product.id}` on the card** keeps each card's selection with its own product. Keying by array index mixes up selections when the list changes (search, interviewer tools).
- **Components declared at module level.** Defining a details component *inside* `ProductCard` (or inside render) creates a new component type every render, so React remounts it and the selection resets.
- **The registry lookup needs one cast.** TypeScript can't link "the component for this key" to "the product with this type" (a correlated-union limitation). One `as` inside the lookup is fine; `any` throughout is not.
- **No `useEffect` to sync the price.** Calling the callback in the click handler is enough. An effect that copies the selection into parent state is a common over-complication.

## What this solution does NOT do (senior extras to probe)

- **Add to cart ignores the selection.** A shoe can be added with no size. Ask: "The size must go into the cart. Where should selection state live?" (Lift it into the card, or a per-card context, and make Add to cart require it.)
- **No data validation** at the API boundary; the API function casts the JSON. A senior might add a type guard or schema per type.
- **No lazy loading** of the type components (`React.lazy` + `Suspense` in the registry).
- **No memoisation.** With 1,000 products it's still fast; `React.memo` on the card or list virtualisation are follow-up topics.
- **Books and groceries aren't built.** Adding one is the quickest way to show the design works: write `BookDetails`, add `book: BookDetails` to the registry.
- **The size picker isn't keyboard-optimal:** each chip is a tab stop. A full radio group uses arrow keys (or native `<input type="radio">`).

## Checked in a browser

- Phone: 4,500 mAh selected by default, $649 → pick 5,200 mAh → **$709**.
- Power bank: 10,000 mAh → **$34**; 26,800 mAh → **$74**. Other cards unaffected.
- Shoes: size 41 disabled; picking 42 selects it.
- Furniture + gift card switched on: 15 cards; books, groceries, furniture and the gift card fall back; no console errors.
- 1,000 products render.
