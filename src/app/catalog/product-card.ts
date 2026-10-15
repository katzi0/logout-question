import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, NgComponentOutlet } from '@angular/common';
import { CartService } from '../shared/cart.service';
import { Rating } from '../shared/rating';
import { detailsComponentFor } from './details/details-registry';
import { ProductCardState } from './product-card-state';
import { Product } from './product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, Rating, NgComponentOutlet],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  // One state per card, visible to the details component rendered inside it.
  providers: [ProductCardState],
})
export class ProductCard {
  private readonly cart = inject(CartService);
  private readonly state = inject(ProductCardState);

  readonly product = input.required<Product>();

  /** The type-specific component for this product, looked up in the registry. */
  protected readonly detailsComponent = computed(() => detailsComponentFor(this.product()));
  protected readonly detailsInputs = computed(() => ({ product: this.product() }));

  /** Base price plus whatever the selected options add. The product itself is never changed. */
  protected readonly displayPrice = computed(() => this.product().price + this.state.priceDelta());

  protected readonly stockLabel = computed(() => {
    const stock = this.product().stock;
    if (stock === 0) return { text: 'Currently unavailable', kind: 'out' };
    if (stock < 5) return { text: `Only ${stock} left in stock`, kind: 'low' };
    return { text: 'In stock', kind: 'ok' };
  });

  protected addToCart(): void {
    this.cart.add(this.product());
  }
}
