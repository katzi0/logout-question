import { Injectable, signal } from '@angular/core';

/**
 * State for ONE card, shared by the card and its type-specific details component.
 *
 * Provided in ProductCard's `providers`, so every card gets its own instance and the
 * details component (created by NgComponentOutlet inside the card) injects the same one.
 * This is how the details can change the card's price: NgComponentOutlet supports
 * inputs but not outputs, so the details can't emit an event back to the card.
 */
@Injectable()
export class ProductCardState {
  /** Added to the product's base price, e.g. a bigger battery option. */
  readonly priceDelta = signal(0);
}
