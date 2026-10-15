import { Type } from '@angular/core';
import { KnownType, Product } from '../product.model';
import { ElectronicsDetailsComponent } from './electronics-details';
import { FallbackDetailsComponent } from './fallback-details';
import { ShoeDetailsComponent } from './shoe-details';

/**
 * Which component shows the details of each product type.
 *
 * Adding a type = write its component + add one line here. The card never changes.
 *
 * `Partial` because books and groceries aren't built yet. Once every known type has a
 * component, drop `Partial` and TypeScript will fail the build if one is missing.
 */
const DETAILS_COMPONENTS: Partial<Record<KnownType, Type<unknown>>> = {
  electronics: ElectronicsDetailsComponent,
  shoes: ShoeDetailsComponent,
};

export function detailsComponentFor(product: Product): Type<unknown> {
  return DETAILS_COMPONENTS[product.type as KnownType] ?? FallbackDetailsComponent;
}
