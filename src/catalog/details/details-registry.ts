import type { ComponentType } from 'react';
import type { KnownProduct, KnownType, Product } from '../product.model';
import { ElectronicsDetails } from './ElectronicsDetails';
import { FallbackDetails } from './FallbackDetails';
import { ShoeDetails } from './ShoeDetails';
import type { DetailsProps } from './types';

/** For each type, a component that receives exactly that type of product. */
type DetailsComponents = {
  [T in KnownType]: ComponentType<DetailsProps<Extract<KnownProduct, { type: T }>>>;
};

/**
 * Which component shows the details of each product type.
 *
 * Adding a type = write its component + add one line here. The card never changes.
 *
 * `Partial` because books and groceries aren't built yet. Once every known type has a
 * component, drop `Partial` and TypeScript will fail the build if one is missing.
 */
const DETAILS_COMPONENTS: Partial<DetailsComponents> = {
  electronics: ElectronicsDetails,
  shoes: ShoeDetails,
};

export function detailsComponentFor(product: Product): ComponentType<DetailsProps> {
  const component = DETAILS_COMPONENTS[product.type as KnownType];
  // TypeScript can't link "the component for this key" to "the product with this type",
  // so the lookup needs one cast. The map's own typing still checks each entry.
  return (component ?? FallbackDetails) as ComponentType<DetailsProps>;
}
