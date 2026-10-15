import { Component, input } from '@angular/core';
import { Product } from '../product.model';

/**
 * Used for any type without its own component: a type the API added that this
 * version of the app doesn't know, or a known type that isn't built yet.
 * The card still shows all the shared info; this just adds nothing.
 */
@Component({ selector: 'app-fallback-details', template: `` })
export class FallbackDetailsComponent {
  readonly product = input.required<Product>();
}
