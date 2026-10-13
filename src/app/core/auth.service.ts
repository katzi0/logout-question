import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { AuthState, User } from './models';

/** How long a successful session check is reused before asking the server again. */
const SESSION_CHECK_TTL_MS = 6 * 60 * 1000;

/**
 * Holds who is logged in.
 *
 * The access token lives in an HttpOnly cookie that the server sets on login.
 * JavaScript can't read it; the browser sends it with every request to /api.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _state = signal<AuthState>('unknown');
  private readonly _user = signal<User | null>(null);

  readonly state = this._state.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._state() === 'authenticated');

  /** Cached result of GET /api/auth/session, shared by everyone who asks within the TTL. */
  private sessionCheck$: Observable<boolean> | null = null;
  private sessionCheckedAt = 0;

  /**
   * Resolves to true if the server says the cookie belongs to a valid session.
   * Used by the route guard, so it's cached to avoid a request on every navigation.
   */
  ensureSession(): Observable<boolean> {
    const isFresh = this.sessionCheck$ !== null && Date.now() - this.sessionCheckedAt < SESSION_CHECK_TTL_MS;
    if (!isFresh) {
      this.sessionCheckedAt = Date.now();
      this.sessionCheck$ = this.http.get<{ user: User }>('/api/auth/session').pipe(
        map(({ user }) => {
          this.setAuthenticated(user);
          return true;
        }),
        catchError(() => {
          this._user.set(null);
          this._state.set('anonymous');
          return of(false);
        }),
        shareReplay(1),
      );
    }
    return this.sessionCheck$!;
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<{ user: User }>('/api/auth/login', { username, password }).pipe(
      map(({ user }) => user),
      tap((user) => {
        this.setAuthenticated(user);
        // The server just confirmed the session, so seed the cache with that answer.
        this.sessionCheck$ = of(true);
        this.sessionCheckedAt = Date.now();
      }),
    );
  }

  /**
   * Called by the "Log out" button in the header.
   *
   * TODO: implement logout.
   */
  logout(): void {
    // TODO
  }

  /** Called by the HTTP interceptor when the API answers 401 (the session ended on the server). */
  markSessionExpired(): void {
    this._user.set(null);
    this._state.set('anonymous');
    this.sessionCheck$ = of(false);
    this.sessionCheckedAt = Date.now();
  }

  private setAuthenticated(user: User): void {
    this._user.set(user);
    this._state.set('authenticated');
  }
}
