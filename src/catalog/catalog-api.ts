import { CATALOG_RESPONSE, NEW_TYPE_PRODUCTS, UNKNOWN_TYPE_PRODUCTS } from './mock-data';
import type { Product } from './product.model';

export interface CatalogOptions {
  includeNewType: boolean;
  includeUnknownType: boolean;
  manyProducts: boolean;
}

/** Fake catalog API. Pretend this is `GET /api/products`. */
export async function getProducts(options: CatalogOptions): Promise<Product[]> {
  let response = [...CATALOG_RESPONSE];
  if (options.includeNewType) response.push(...NEW_TYPE_PRODUCTS);
  if (options.includeUnknownType) response.push(...UNKNOWN_TYPE_PRODUCTS);
  if (options.manyProducts) response = repeatTo(response, 1000);

  await new Promise((resolve) => setTimeout(resolve, 400));
  // JSON from the network: deep copy so nobody mutates the source data.
  return JSON.parse(JSON.stringify(response)) as Product[];
}

function repeatTo(items: unknown[], count: number): unknown[] {
  return Array.from({ length: count }, (_, i) => {
    const item = items[i % items.length] as Product;
    return { ...item, id: `${item.id}-${i}` };
  });
}
