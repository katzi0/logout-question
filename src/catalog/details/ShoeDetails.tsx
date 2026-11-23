import { useState } from 'react';
import type { ShoeProduct } from '../product.model';
import type { DetailsProps } from './types';

export function ShoeDetails({ product }: DetailsProps<ShoeProduct>) {
  const { sizeSystem, sizes, width, colors } = product.details;

  // No size picked until the user picks one.
  const [selected, setSelected] = useState<string | null>(null);
  const labelId = `size-${product.id}`;

  return (
    <div>
      <p className="detail-label" id={labelId}>
        Size ({sizeSystem}) {width === 'wide' && <span className="badge">Wide fit</span>}
      </p>
      <div className="sizes" role="radiogroup" aria-labelledby={labelId}>
        {sizes.map((s) => (
          <button
            key={s.size}
            type="button"
            className="chip size"
            role="radio"
            disabled={!s.inStock}
            aria-checked={selected === s.size}
            aria-label={s.inStock ? s.size : `${s.size}, out of stock`}
            onClick={() => setSelected(s.size)}
          >
            {s.size}
          </button>
        ))}
      </div>
      {colors && colors.length > 0 && (
        <div className="colors">
          {colors.map((c) => (
            <span key={c.hex} className="swatch" title={c.name} style={{ '--swatch': c.hex } as React.CSSProperties} />
          ))}
          <span className="color-count">{colors.length} colors</span>
        </div>
      )}
    </div>
  );
}
