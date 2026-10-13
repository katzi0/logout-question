import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../shared/cart.service';
import { Rating } from '../shared/rating';
import { Product } from './product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, Rating],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private readonly cart = inject(CartService);

  readonly product = input.required<Product>();

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
