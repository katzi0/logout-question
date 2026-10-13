import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/** When a data call gets 401, the session is over: go to the login page. */
export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      const isAuthOrDevCall = req.url.startsWith('/api/auth/') || req.url.startsWith('/api/dev/');
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthOrDevCall) {
        auth.markSessionExpired();
        router.navigate(['/login'], { queryParams: { expired: 1 } });
      }
      return throwError(() => error);
    }),
  );
};
