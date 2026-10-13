import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-account-page',
  template: `
    <div class="page-head">
      <div>
        <h1>Account</h1>
        <p class="muted">Details from your current session</p>
      </div>
    </div>
    <section class="card">
      @if (auth.user(); as user) {
        <dl class="details">
          <dt>Name</dt><dd>{{ user.name }}</dd>
          <dt>Username</dt><dd class="mono">{{ user.username }}</dd>
          <dt>Role</dt><dd><span class="badge">{{ user.role }}</span></dd>
          <dt>User ID</dt><dd class="mono">{{ user.id }}</dd>
        </dl>
      } @else {
        <p class="empty">No user loaded.</p>
      }
    </section>
  `,
})
export class AccountPage {
  protected readonly auth = inject(AuthService);
}
