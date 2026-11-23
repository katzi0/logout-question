import { useState } from 'react';
import type { ElectronicsProduct } from '../product.model';
import type { DetailsProps } from './types';

const money = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

export function ElectronicsDetails({ product, onPriceDeltaChange }: DetailsProps<ElectronicsProduct>) {
  const { chip, batteryOptions } = product.details;

  // Start on the option with no extra cost, so the card's price is right before any click.
  const [selected, setSelected] = useState(
    () => batteryOptions.find((o) => o.priceDelta === 0)?.capacityMah ?? null,
  );

  const select = (capacityMah: number, priceDelta: number) => {
    setSelected(capacityMah);
    onPriceDeltaChange(priceDelta);
  };

  const labelId = `battery-${product.id}`;

  return (
    <div>
      {chip && (
        <p className="spec">
          <span aria-hidden="true">⚙️</span> {chip.name} · {chip.cores}-core
        </p>
      )}
      <p className="detail-label" id={labelId}>
        Battery
      </p>
      <div className="options" role="radiogroup" aria-labelledby={labelId}>
        {batteryOptions.map((opt) => (
          <button
            key={opt.capacityMah}
            type="button"
            className="chip battery"
            role="radio"
            aria-checked={selected === opt.capacityMah}
            onClick={() => select(opt.capacityMah, opt.priceDelta)}
          >
            <span aria-hidden="true">🔋</span> {opt.capacityMah.toLocaleString('en-US')} mAh
            {opt.priceDelta !== 0 && (
              <span className="delta">
                {opt.priceDelta > 0 ? '+' : '−'}
                {money(Math.abs(opt.priceDelta), product.currency)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
