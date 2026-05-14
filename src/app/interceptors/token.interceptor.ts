import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isAuthRequest = req.url.includes('/auth/');

  if (token && authService.isTokenExpired(token)) {
    authService.logout();
  }

  const request = token && !authService.isTokenExpired(token) && !isAuthRequest
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 401 && !isAuthRequest) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
