// The data model: a discriminated union on `type`.
//
// Shared fields live in ProductBase. Each known type adds its own `details` shape.
// TypeScript narrows `details` as soon as you check `type`, so no `any` is needed.

interface ProductBase {
  id: string;
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
}

export interface ElectronicsDetails {
  chip?: { name: string; cores: number };
  batteryOptions: { capacityMah: number; priceDelta: number }[];
  storageGb?: number[];
  connectivity?: string[];
}

export interface ShoeDetails {
  sizeSystem: 'EU' | 'US' | 'UK';
  /** Strings, not numbers: kids' sizes look like "10K" or "1Y". */
  sizes: { size: string; inStock: boolean }[];
  width: 'regular' | 'wide';
  colors?: { name: string; hex: string }[];
}

export interface BookDetails {
  author: string;
  pages: number;
  language: string;
  formats: { format: 'hardcover' | 'paperback' | 'ebook' | 'audiobook'; price: number }[];
}

export interface GroceryDetails {
  weight: { value: number; unit: 'g' | 'kg' | 'ml' | 'l' };
  organic: boolean;
  bestBefore: string;
  dietary: string[];
}

export type ElectronicsProduct = ProductBase & { type: 'electronics'; details: ElectronicsDetails };
export type ShoeProduct = ProductBase & { type: 'shoes'; details: ShoeDetails };
export type BookProduct = ProductBase & { type: 'book'; details: BookDetails };
export type GroceryProduct = ProductBase & { type: 'grocery'; details: GroceryDetails };

/** The API may send a type this version of the app doesn't know yet. */
export type UnknownProduct = ProductBase & { type: string & {}; details: unknown };

export type KnownProduct = ElectronicsProduct | ShoeProduct | BookProduct | GroceryProduct;
export type Product = KnownProduct | UnknownProduct;
export type KnownType = KnownProduct['type'];
