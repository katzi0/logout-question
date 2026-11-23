import { useEffect, useState } from 'react';
import { getProducts, type CatalogOptions } from './catalog-api';
import type { Product } from './product.model';

/** Loads the catalog, and loads it again when the options change. */
export function useProducts(options: CatalogOptions) {
  const [state, setState] = useState<{ loading: boolean; products: Product[] }>({ loading: true, products: [] });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, products: [] });
    getProducts(options).then((products) => {
      if (!cancelled) setState({ loading: false, products });
    });
    return () => {
      cancelled = true;
    };
  }, [options]);

  return state;
}
