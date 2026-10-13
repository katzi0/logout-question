import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { CATALOG_RESPONSE, NEW_TYPE_PRODUCTS, UNKNOWN_TYPE_PRODUCTS } from './mock-data';
import { Product } from './product.model';

export interface CatalogOptions {
  includeNewType: boolean;
  includeUnknownType: boolean;
  manyProducts: boolean;
}

/** Fake catalog API. Pretend this is `GET /api/products`. */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  getProducts(options: CatalogOptions): Observable<Product[]> {
    let response = [...CATALOG_RESPONSE];
    if (options.includeNewType) response.push(...NEW_TYPE_PRODUCTS);
    if (options.includeUnknownType) response.push(...UNKNOWN_TYPE_PRODUCTS);
    if (options.manyProducts) response = repeatTo(response, 1000);

    // JSON from the network: deep copy so nobody mutates the source data.
    const products = JSON.parse(JSON.stringify(response)) as Product[];
    return of(products).pipe(delay(400));
  }
}

function repeatTo(items: unknown[], count: number): unknown[] {
  return Array.from({ length: count }, (_, i) => {
    const item = items[i % items.length] as Product;
    return { ...item, id: `${item.id}-${i}` };
  });
}
