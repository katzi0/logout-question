import { useMemo } from 'react';
import { useDevSettings } from '../dev/dev-settings';
import { useSearch } from '../shared/search';
import { ProductCard } from './ProductCard';
import { useProducts } from './useProducts';

export function CatalogPage() {
  const { options } = useDevSettings();
  const { query } = useSearch();
  const { loading, products } = useProducts(options);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => `${p.title} ${p.brand}`.toLowerCase().includes(q)) : products;
  }, [products, query]);

  return (
    <>
      <div className="results-head">
        <h1>Results</h1>
        {!loading && (
          <p>
            {visible.length} {visible.length === 1 ? 'item' : 'items'}
            {query && (
              <>
                {' '}
                for <strong>"{query}"</strong>
              </>
            )}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="no-results">No products match your search.</p>
      ) : (
        <div className="grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
