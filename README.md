> **Interviewer reference solution — don't share this branch with candidates.**
> The candidate version is the `catalog` branch. What this solution shows and how to use it: [`SOLUTION.md`](SOLUTION.md).

# Catalog exercise

**Marketly** is an online store. The catalog page shows a grid of product cards.

Every card already shows what all products have in common: image, title, brand, rating, price, delivery and stock. But each **product type** also has its own information, and that part isn't shown yet. For example:

- **Electronics** have battery options. Show them as chips (with their own look), and picking one should change the price.
- **Shoes** have sizes. Show a size picker, where sizes that are out of stock can't be picked.
- **Books** come in formats (hardcover, paperback, e-book…), each with its own price.
- **Groceries** have a weight, an organic label, a best-before date…

The catalog keeps growing: other teams add new product types all the time.

## Your task

1. **Explain your approach first** (about 5 minutes). How will the card show different information for each product type? How do you model the data? What happens when a new type is added?
2. **Implement it.** Start with **electronics** and **shoes**, then add more types if you have time.

You decide what the type-specific part shows and how it looks. The data has more fields than you need; pick what's useful. You can change any file under `src/app/` except `src/app/dev/`.

Talk through your decisions as you go.

## Running it

- **StackBlitz:** it installs and starts by itself.
- **Locally:** `npm install`, then `npm start`, and open http://localhost:4200.

## Where things are

| File | What it does |
|---|---|
| `src/app/catalog/mock-data.ts` | **What the API returns.** Look here to see each type's `details`. |
| `src/app/catalog/product.model.ts` | The `Product` type. Shared fields are typed; `details` is `unknown`. |
| `src/app/catalog/catalog.service.ts` | Fake API (`GET /api/products`) |
| `src/app/catalog/catalog.page.ts` | The grid |
| `src/app/catalog/product-card.*` | The card. Look for `TODO: type-specific details`. |
| `src/app/shared/cart.service.ts` | Cart (the count in the header) |
| `src/styles.css` | Global styles. There are ready-made `.chip`, `.badge` and `.swatch` classes at the top; use them or don't. |

The app uses Angular 21 with standalone components, signals and zoneless change detection.

The **Interviewer tools** box in the corner is for the interviewer. You can ignore it.
