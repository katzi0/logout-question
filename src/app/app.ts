import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevPanel } from './dev/dev-panel';

function isEmbedded(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DevPanel],
  template: `
    <router-outlet />
    <app-dev-panel />

    @if (embedded && !dismissed()) {
      <div class="embed-overlay" role="dialog" aria-labelledby="embed-title">
        <div class="embed-card">
          <h2 id="embed-title">Open the app in its own tab</h2>
          <p>
            The editor preview runs inside a frame on another site, so the browser won't store the login cookie
            here. Use the app in a separate tab (you'll want DevTools there anyway).
          </p>
          <div class="embed-actions">
            <button class="btn btn-primary" type="button" (click)="openInNewTab()">Open in new tab</button>
            <button class="btn btn-ghost" type="button" (click)="dismissed.set(true)">Stay here</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class App {
  protected readonly embedded = isEmbedded();
  protected readonly dismissed = signal(false);

  protected openInNewTab(): void {
    window.open(location.href, '_blank', 'noopener');
  }
}
