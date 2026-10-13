import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface DevState {
  failLogout: boolean;
  slowApi: boolean;
  lastSession: { user: string; status: 'active' | 'revoked'; createdAt: number } | null;
  activeSessions: number;
}

/**
 * Interviewer tools. Not part of the exercise — leave this file alone.
 * Talks to /api/dev/* on the mock server.
 */
@Component({
  selector: 'app-dev-panel',
  template: `
    <aside class="dev" [class.open]="open()">
      <button class="dev-toggle" type="button" (click)="toggle()">
        <span class="dev-dot" [class.on]="state()?.failLogout || state()?.slowApi"></span>
        Interviewer tools {{ open() ? '▾' : '▴' }}
      </button>

      @if (open()) {
        <div class="dev-body">
          <div class="dev-row">
            <span class="dev-label">Last login on the server</span>
            @if (state()?.lastSession; as s) {
              <span>
                <span class="mono">{{ s.user }}</span> ·
                <span class="pill" [attr.data-kind]="s.status">{{ s.status }}</span>
              </span>
            } @else {
              <span class="muted">none yet</span>
            }
          </div>

          <div class="dev-row">
            <span class="dev-label">Copied cookie</span>
            <span class="dev-inline">
              <button class="btn btn-small" type="button" (click)="replay()">Replay last login's cookie</button>
              @if (replayResult(); as r) {
                <span class="pill" [attr.data-kind]="r.status === 200 ? 'bad' : r.status === 401 ? 'good' : 'neutral'">
                  {{ r.status }}
                </span>
                <span class="dev-note">{{ r.message }}</span>
              }
            </span>
          </div>

          <label class="dev-row dev-switch">
            <span class="dev-label">Logout call fails (503)</span>
            <input type="checkbox" [checked]="state()?.failLogout" (change)="set('failLogout', $any($event.target).checked)" />
          </label>

          <label class="dev-row dev-switch">
            <span class="dev-label">Slow orders API (2 s)</span>
            <input type="checkbox" [checked]="state()?.slowApi" (change)="set('slowApi', $any($event.target).checked)" />
          </label>

          <div class="dev-row">
            <span class="dev-label">Start over</span>
            <button class="btn btn-small" type="button" (click)="reset()">Reset server and reload</button>
          </div>
        </div>
      }
    </aside>
  `,
})
export class DevPanel {
  private readonly http = inject(HttpClient);

  protected readonly open = signal(false);
  protected readonly state = signal<DevState | null>(null);
  protected readonly replayResult = signal<{ status: number | string; message: string } | null>(null);

  constructor() {
    this.refresh();
    const timer = setInterval(() => this.open() && this.refresh(), 1500);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  protected toggle(): void {
    this.open.update((v) => !v);
    if (this.open()) this.refresh();
  }

  protected set(key: 'failLogout' | 'slowApi', value: boolean): void {
    this.http.post<DevState>('/api/dev/settings', { [key]: value }).subscribe((s) => this.state.set(s));
  }

  protected replay(): void {
    this.http
      .post<{ status: number | string; message: string }>('/api/dev/replay', {})
      .subscribe((r) => this.replayResult.set(r));
  }

  protected reset(): void {
    this.http.post('/api/dev/reset', {}).subscribe(() => location.assign('/login'));
  }

  private refresh(): void {
    this.http.get<DevState>('/api/dev/state').subscribe({
      next: (s) => this.state.set(s),
      error: () => this.state.set(null),
    });
  }
}
