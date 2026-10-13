import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  template: `
    <main class="login">
      <section class="login-card">
        <div class="brand brand-lg"><span class="brand-mark">O</span> Orders</div>
        <h1>Log in</h1>

        @if (expired()) {
          <p class="notice">Your session has ended. Please log in again.</p>
        }

        <form (ngSubmit)="submit()">
          <label>
            Username
            <input name="username" autocomplete="username" [(ngModel)]="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autocomplete="current-password" [(ngModel)]="password" required />
          </label>
          @if (error()) {
            <p class="error" role="alert">{{ error() }}</p>
          }
          <button class="btn btn-primary btn-block" type="submit" [disabled]="busy()">
            {{ busy() ? 'Logging in…' : 'Log in' }}
          </button>
        </form>

        <div class="test-users">
          <span>Test users</span>
          @for (u of testUsers; track u.username) {
            <button type="button" class="chip" (click)="fill(u.username, u.password)">
              {{ u.username }} <code>{{ u.password }}</code>
            </button>
          }
        </div>
      </section>
    </main>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Query params, bound by the router. */
  readonly returnUrl = input<string>();
  readonly expired = input<string>();

  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly error = signal<string | null>(null);
  protected readonly busy = signal(false);

  protected readonly testUsers = [
    { username: 'alice', password: 'alice123' },
    { username: 'bob', password: 'bob123' },
    { username: 'admin', password: 'admin123' },
  ];

  protected fill(username: string, password: string): void {
    this.username.set(username);
    this.password.set(password);
    this.error.set(null);
  }

  protected submit(): void {
    this.busy.set(true);
    this.error.set(null);
    this.auth.login(this.username(), this.password()).subscribe({
      next: () => {
        this.busy.set(false);
        const target = this.returnUrl();
        this.router.navigateByUrl(target && target.startsWith('/') && !target.startsWith('/login') ? target : '/dashboard');
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(e?.status === 401 ? 'Wrong username or password' : 'Something went wrong. Try again.');
      },
    });
  }
}
