import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from './models';

/** Keeps the current user's orders in memory so pages don't refetch on every visit. */
@Injectable({ providedIn: 'root' })
export class OrdersStore {
  private readonly http = inject(HttpClient);

  private readonly _orders = signal<Order[]>([]);
  private readonly _loading = signal(false);
  private loaded = false;

  readonly orders = this._orders.asReadonly();
  readonly loading = this._loading.asReadonly();

  /** Loads the orders once; pass `force` to fetch again. */
  load(force = false): void {
    if (this.loaded && !force) return;
    this._loading.set(true);
    this.http.get<{ orders: Order[] }>('/api/orders').subscribe({
      next: ({ orders }) => {
        this._orders.set(orders);
        this.loaded = true;
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }
}
