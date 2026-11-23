import { Rating } from '../shared/Rating';
import { useCart } from '../shared/cart';
import type { Product } from './product.model';
import './ProductCard.css';

function stockLabel(stock: number) {
  if (stock === 0) return { text: 'Currently unavailable', kind: 'out' };
  if (stock < 5) return { text: `Only ${stock} left in stock`, kind: 'low' };
  return { text: 'In stock', kind: 'ok' };
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const stock = stockLabel(product.stock);
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price);

  return (
    <article className="card">
      <div className="thumb" style={{ background: product.thumbnail.tint }} aria-hidden="true">
        <span>{product.thumbnail.emoji}</span>
      </div>

      <div className="body">
        <h2 className="title">{product.title}</h2>
        <p className="brand">by {product.brand}</p>
        <Rating value={product.rating} count={product.reviewCount} />

        <p className="price">{price}</p>

        {/* TODO: type-specific details */}
        <div className="details"></div>

        <div className="meta">
          {product.fastDelivery && <span className="fast">Fast delivery · Tomorrow</span>}
          <span className="stock" data-kind={stock.kind}>
            {stock.text}
          </span>
        </div>

        <button className="add" type="button" disabled={product.stock === 0} onClick={() => add(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}
