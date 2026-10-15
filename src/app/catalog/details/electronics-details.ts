import { Component, OnInit, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ElectronicsProduct } from '../product.model';
import { ProductCardState } from '../product-card-state';

@Component({
  selector: 'app-electronics-details',
  imports: [CurrencyPipe, DecimalPipe],
  template: `
    @if (product().details.chip; as chip) {
      <p class="spec"><span aria-hidden="true">⚙️</span> {{ chip.name }} · {{ chip.cores }}-core</p>
    }

    <p class="label" [id]="labelId()">Battery</p>
    <div class="options" role="radiogroup" [attr.aria-labelledby]="labelId()">
      @for (opt of product().details.batteryOptions; track opt.capacityMah) {
        <button
          type="button"
          class="chip battery"
          role="radio"
          [attr.aria-checked]="selected() === opt.capacityMah"
          (click)="select(opt.capacityMah, opt.priceDelta)"
        >
          <span aria-hidden="true">🔋</span> {{ opt.capacityMah | number }} mAh
          @if (opt.priceDelta !== 0) {
            <span class="delta">{{ opt.priceDelta > 0 ? '+' : '−' }}{{ abs(opt.priceDelta) | currency: product().currency : 'symbol' : '1.0-0' }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: `
    .spec { margin: 0 0 8px; font-size: 0.8rem; color: var(--muted); }
    .label { margin: 0 0 4px; font-size: 0.75rem; color: var(--muted); }
    .options { display: flex; flex-wrap: wrap; gap: 6px; }
    .battery { border-radius: 999px; }
    .battery[aria-checked='true'] { background: #e3f5ec; border-color: #1f8a5b; color: #17663f; }
    .delta { font-weight: 500; opacity: 0.75; }
    @media (prefers-color-scheme: dark) {
      .battery[aria-checked='true'] { background: #173226; border-color: #5fd09a; color: #8de0b6; }
    }
  `,
})
export class ElectronicsDetailsComponent implements OnInit {
  private readonly cardState = inject(ProductCardState);

  readonly product = input.required<ElectronicsProduct>();

  /** Starts on the base option (no extra cost), so the card's price is right before any click. */
  protected readonly selected = signal<number | null>(null);

  protected labelId = () => `battery-${this.product().id}`;
  protected abs = Math.abs;

  ngOnInit(): void {
    const base = this.product().details.batteryOptions.find((o) => o.priceDelta === 0);
    this.selected.set(base?.capacityMah ?? null);
  }

  protected select(capacityMah: number, priceDelta: number): void {
    this.selected.set(capacityMah);
    this.cardState.priceDelta.set(priceDelta);
  }
}
