import { Component } from '@angular/core';
import { CatalogPage } from './catalog/catalog.page';
import { DevPanel } from './dev/dev-panel';
import { Header } from './layout/header';

@Component({
  selector: 'app-root',
  imports: [Header, CatalogPage, DevPanel],
  template: `
    <app-header />
    <main class="page">
      <app-catalog-page />
    </main>
    <app-dev-panel />
  `,
})
export class App {}
