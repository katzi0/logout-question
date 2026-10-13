import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

/** Layout for logged-in pages: header with navigation, the current user and a Log out button. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" routerLink="/dashboard"><span class="brand-mark">O</span> Orders</a>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/account" routerLinkActive="active">Account</a>
        </nav>
        <div class="user">
          @if (auth.user(); as user) {
            <span class="avatar" aria-hidden="true">{{ initials() }}</span>
            <span class="user-name">{{ user.name }}</span>
          }
          <button class="btn btn-ghost" type="button" (click)="logout()">Log out</button>
        </div>
      </div>
    </header>
    <main class="page">
      <router-outlet />
    </main>
  `,
})
export class Shell {
  protected readonly auth = inject(AuthService);

  protected readonly initials = computed(() =>
    (this.auth.user()?.name ?? '')
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2),
  );

  protected logout(): void {
    this.auth.logout();
  }
}
