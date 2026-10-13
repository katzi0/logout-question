import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../catalog/product.model';

export interface CartLine {
  productId: string;
  title: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _lines = signal<CartLine[]>([]);
  readonly lines = this._lines.asReadonly();
  readonly count = computed(() => this._lines().reduce((sum, l) => sum + l.quantity, 0));
  readonly lastAdded = signal<string | null>(null);

  add(product: Product): void {
    this._lines.update((lines) => {
      const existing = lines.find((l) => l.productId === product.id);
      return existing
        ? lines.map((l) => (l === existing ? { ...l, quantity: l.quantity + 1 } : l))
        : [...lines, { productId: product.id, title: product.title, quantity: 1 }];
    });
    this.lastAdded.set(product.title);
  }
}
