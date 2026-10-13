import { Component, inject, signal } from '@angular/core';
import { DevSettings } from './dev-settings.service';

/** Interviewer tools. Not part of the exercise — leave this file alone. */
@Component({
  selector: 'app-dev-panel',
  template: `
    <aside class="dev">
      <button class="dev-toggle" type="button" (click)="open.set(!open())">
        <span class="dev-dot" [class.on]="anyOn()"></span>
        Interviewer tools {{ open() ? '▾' : '▴' }}
      </button>
      @if (open()) {
        <div class="dev-body">
          <label class="dev-row">
            <span>API sends a new type (<code>furniture</code>)</span>
            <input type="checkbox" [checked]="dev.catalog().includeNewType" (change)="dev.set('includeNewType', $any($event.target).checked)" />
          </label>
          <label class="dev-row">
            <span>API sends an unknown type (<code>gift-card</code>)</span>
            <input type="checkbox" [checked]="dev.catalog().includeUnknownType" (change)="dev.set('includeUnknownType', $any($event.target).checked)" />
          </label>
          <label class="dev-row">
            <span>1,000 products</span>
            <input type="checkbox" [checked]="dev.catalog().manyProducts" (change)="dev.set('manyProducts', $any($event.target).checked)" />
          </label>
        </div>
      }
    </aside>
  `,
})
export class DevPanel {
  protected readonly dev = inject(DevSettings);
  protected readonly open = signal(false);

  protected anyOn(): boolean {
    const s = this.dev.catalog();
    return s.includeNewType || s.includeUnknownType || s.manyProducts;
  }
}
