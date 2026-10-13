import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, switchMap } from 'rxjs';
import { DevSettings } from '../dev/dev-settings.service';
import { SearchService } from '../shared/search.service';
import { CatalogService } from './catalog.service';
import { ProductCard } from './product-card';
import { Product } from './product.model';

interface CatalogState {
  loading: boolean;
  products: Product[];
}

@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard],
  template: `
    <div class="results-head">
      <h1>Results</h1>
      @if (!state().loading) {
        <p>{{ visible().length }} {{ visible().length === 1 ? 'item' : 'items' }}
          @if (search.query()) { for <strong>"{{ search.query() }}"</strong> }
        </p>
      }
    </div>

    @if (state().loading) {
      <div class="grid">
        @for (i of skeletons; track i) {
          <div class="skeleton"></div>
        }
      </div>
    } @else if (visible().length === 0) {
      <p class="no-results">No products match your search.</p>
    } @else {
      <div class="grid">
        @for (product of visible(); track product.id) {
          <app-product-card [product]="product" />
        }
      </div>
    }
  `,
})
export class CatalogPage {
  private readonly catalog = inject(CatalogService);
  private readonly dev = inject(DevSettings);
  protected readonly search = inject(SearchService);

  protected readonly skeletons = [1, 2, 3, 4, 5, 6, 7, 8];

  protected readonly state = toSignal(
    toObservable(this.dev.catalog).pipe(
      switchMap((options) =>
        this.catalog.getProducts(options).pipe(
          map((products): CatalogState => ({ loading: false, products })),
          startWith<CatalogState>({ loading: true, products: [] }),
        ),
      ),
    ),
    { initialValue: { loading: true, products: [] } as CatalogState },
  );

  protected readonly visible = computed(() => {
    const q = this.search.query().trim().toLowerCase();
    const products = this.state().products;
    return q ? products.filter((p) => `${p.title} ${p.brand}`.toLowerCase().includes(q)) : products;
  });
}
