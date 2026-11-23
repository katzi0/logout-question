import { useCart } from '../shared/cart';
import { useSearch } from '../shared/search';

export function Header() {
  const { query, setQuery } = useSearch();
  const { count } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo" href="/">
          market<span>ly</span>
        </a>
        <label className="search">
          <span className="sr-only">Search products</span>
          <input type="search" placeholder="Search Marketly" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="cart" aria-live="polite">
          <span className="cart-icon" aria-hidden="true">
            🛒
          </span>
          <span className="cart-count">{count}</span>
          <span className="cart-label">Cart</span>
        </div>
      </div>
    </header>
  );
}
