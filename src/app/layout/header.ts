import { Component, inject } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { SearchService } from '../shared/search.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <div class="header-inner">
        <a class="logo" href="/">market<span>ly</span></a>
        <label class="search">
          <span class="sr-only">Search products</span>
          <input
            type="search"
            placeholder="Search Marketly"
            [value]="search.query()"
            (input)="search.query.set($any($event.target).value)"
          />
        </label>
        <div class="cart" aria-live="polite">
          <span class="cart-icon" aria-hidden="true">🛒</span>
          <span class="cart-count">{{ cart.count() }}</span>
          <span class="cart-label">Cart</span>
        </div>
      </div>
    </header>
  `,
})
export class Header {
  protected readonly search = inject(SearchService);
  protected readonly cart = inject(CartService);
}
