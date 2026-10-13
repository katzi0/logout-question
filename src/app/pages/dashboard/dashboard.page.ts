import { Component, OnInit, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { OrdersStore } from '../../core/orders.store';

@Component({
  selector: 'app-dashboard-page',
  imports: [CurrencyPipe],
  template: `
    <div class="page-head">
      <div>
        <h1>Hi {{ firstName() }}</h1>
        <p class="muted">Your recent orders</p>
      </div>
      <button class="btn btn-ghost" type="button" (click)="store.load(true)" [disabled]="store.loading()">
        {{ store.loading() ? 'Loading…' : 'Reload' }}
      </button>
    </div>

    <section class="card">
      @if (store.loading() && store.orders().length === 0) {
        <p class="empty">Loading orders…</p>
      } @else if (store.orders().length === 0) {
        <p class="empty">No orders yet.</p>
      } @else {
        <table class="orders">
          <thead>
            <tr><th>Order</th><th>Item</th><th>Status</th><th class="num">Total</th></tr>
          </thead>
          <tbody>
            @for (o of store.orders(); track o.id) {
              <tr>
                <td class="mono">#{{ o.id }}</td>
                <td>{{ o.item }}</td>
                <td><span class="status" [attr.data-status]="o.status">{{ o.status }}</span></td>
                <td class="num">{{ o.total | currency: 'ILS' : 'symbol' : '1.0-0' }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
})
export class DashboardPage implements OnInit {
  private readonly auth = inject(AuthService);
  protected readonly store = inject(OrdersStore);

  protected readonly firstName = computed(() => this.auth.user()?.name.split(' ')[0] ?? '');

  ngOnInit(): void {
    this.store.load();
  }
}
