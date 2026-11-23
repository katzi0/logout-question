import type { Product } from '../product.model';

/** Props every type-specific details component receives. Same shape for all of them. */
export interface DetailsProps<P extends Product = Product> {
  product: P;
  /** Tell the card how much the current selection adds to the base price. */
  onPriceDeltaChange: (delta: number) => void;
}
