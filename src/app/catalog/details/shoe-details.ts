import { Component, input, signal } from '@angular/core';
import { ShoeProduct } from '../product.model';

@Component({
  selector: 'app-shoe-details',
  template: `
    <p class="label" [id]="labelId()">
      Size ({{ product().details.sizeSystem }})
      @if (product().details.width === 'wide') {
        <span class="badge">Wide fit</span>
      }
    </p>

    <div class="sizes" role="radiogroup" [attr.aria-labelledby]="labelId()">
      @for (s of product().details.sizes; track s.size) {
        <button
          type="button"
          class="chip size"
          role="radio"
          [disabled]="!s.inStock"
          [attr.aria-checked]="selected() === s.size"
          [attr.aria-label]="s.inStock ? s.size : s.size + ', out of stock'"
          (click)="selected.set(s.size)"
        >
          {{ s.size }}
        </button>
      }
    </div>

    @if (product().details.colors?.length) {
      <div class="colors">
        @for (c of product().details.colors; track c.hex) {
          <span class="swatch" [style.--swatch]="c.hex" [title]="c.name"></span>
        }
        <span class="color-count">{{ product().details.colors!.length }} colors</span>
      </div>
    }
  `,
  styles: `
    .label { display: flex; align-items: center; gap: 6px; margin: 0 0 4px; font-size: 0.75rem; color: var(--muted); }
    .sizes { display: flex; flex-wrap: wrap; gap: 4px; }
    .size { min-width: 40px; justify-content: center; border-radius: 6px; font-variant-numeric: tabular-nums; }
    .colors { display: flex; align-items: center; gap: 4px; margin-top: 8px; }
    .color-count { font-size: 0.75rem; color: var(--muted); margin-left: 4px; }
  `,
})
export class ShoeDetailsComponent {
  readonly product = input.required<ShoeProduct>();

  /** No size picked until the user picks one. */
  protected readonly selected = signal<string | null>(null);

  protected labelId = () => `size-${this.product().id}`;
}
