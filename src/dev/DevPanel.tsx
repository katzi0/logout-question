import { useState } from 'react';
import type { CatalogOptions } from '../catalog/catalog-api';
import { useDevSettings } from './dev-settings';

/** Interviewer tools. Not part of the exercise — leave this file alone. */
export function DevPanel() {
  const { options, set } = useDevSettings();
  const [open, setOpen] = useState(false);
  const anyOn = options.includeNewType || options.includeUnknownType || options.manyProducts;

  const row = (key: keyof CatalogOptions, label: React.ReactNode) => (
    <label className="dev-row">
      <span>{label}</span>
      <input type="checkbox" checked={options[key]} onChange={(e) => set(key, e.target.checked)} />
    </label>
  );

  return (
    <aside className="dev">
      <button className="dev-toggle" type="button" onClick={() => setOpen(!open)}>
        <span className={`dev-dot${anyOn ? ' on' : ''}`} />
        Interviewer tools {open ? '▾' : '▴'}
      </button>
      {open && (
        <div className="dev-body">
          {row('includeNewType', <>API sends a new type (<code>furniture</code>)</>)}
          {row('includeUnknownType', <>API sends an unknown type (<code>gift-card</code>)</>)}
          {row('manyProducts', '1,000 products')}
        </div>
      )}
    </aside>
  );
}
