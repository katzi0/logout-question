import { Injectable, signal } from '@angular/core';
import { CatalogOptions } from '../catalog/catalog.service';

/** Interviewer tools state. Not part of the exercise. */
@Injectable({ providedIn: 'root' })
export class DevSettings {
  readonly catalog = signal<CatalogOptions>({
    includeNewType: false,
    includeUnknownType: false,
    manyProducts: false,
  });

  set<K extends keyof CatalogOptions>(key: K, value: CatalogOptions[K]): void {
    this.catalog.update((s) => ({ ...s, [key]: value }));
  }
}
