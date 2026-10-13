/** Fields every product has, whatever its type. */
export interface Product {
  id: string;
  /** What kind of product this is, e.g. "electronics" or "shoes". */
  type: string;
  title: string;
  brand: string;
  /** Lowest price, in `currency`. */
  price: number;
  currency: string;
  /** 0–5 */
  rating: number;
  reviewCount: number;
  thumbnail: { emoji: string; tint: string };
  fastDelivery: boolean;
  /** Units left. 0 = out of stock. */
  stock: number;

  /**
   * Fields that only make sense for this product's type
   * (battery options for electronics, sizes for shoes, …).
   *
   * Not modelled yet. See mock-data.ts for what the API sends.
   */
  details: unknown;
}
