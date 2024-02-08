import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  catchError, filter, take, switchMap,
} from 'rxjs/operators';
import { Environment } from 'src/app/modules/env';
import { AuthService } from '../services';

@Injectable()
export class ApiBearerInterceptor implements HttpInterceptor {
  private isRefreshTokenPending$ = this.authService.isRefreshTokenPending$;

  constructor(
    private environment: Environment,
    private authService: AuthService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApiRequest = request.url.indexOf(this.environment.apiUrl) !== -1;
    const isRefreshTokenRequest = request.url === this.authService.getRefreshTokenUrl();

    if (isApiRequest && !isRefreshTokenRequest) {
      // Intercept only API request
      return this.interceptApiRequest(request, next);
    }

    return next.handle(request);
  }

  interceptApiRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.isRefreshTokenPending$.pipe(
      take(1),
      switchMap((isRefreshTokenPending) => {
        if (isRefreshTokenPending) {
          // If tokens are currently refreshing
          // defer the intercepted request until the refresh token process is over
          return this.deferRequestUntilRefreshTokenIsComplete(request, next);
        }

        // Send the request and check if it return an 401 error
        return this.intercept401Error(request, next);
      }),
    );
  }

  deferRequestUntilRefreshTokenIsComplete(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.isRefreshTokenPending$.pipe(
      filter((isRefreshTokenPending) => isRefreshTokenPending === false),
      take(1),
      // Once the refresh token process is over, send the request
      switchMap(() => {
        const requestWithHeaders = this.addHeaders(request);
        return next.handle(requestWithHeaders);
      }),
    );
  }

  intercept401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestWithHeaders = this.addHeaders(request);

    if (!requestWithHeaders.headers.get('Authorization')) {
      // Allow request when not logged in
      return next.handle(request);
    }

    return (
      next.handle(requestWithHeaders)
        .pipe(
          catchError((error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 401) {
                // Start a refresh token process (if not already started)
                this.sendRefreshTokenRequest();

                // Defer the intercepted request until the refresh token process is over
                return this.deferRequestUntilRefreshTokenIsComplete(request, next);
              }
            }

            return throwError(() => error);
          }),
        )
    );
  }

  addHeaders(request: HttpRequest<any>): HttpRequest<any> {
    // Get headers manually set
    const headers: any = {};
    request.headers.keys().forEach((key) => {
      headers[key] = request.headers.get(key);
    });

    if (this.authService.tokens.accessToken) {
      headers.Authorization = `Bearer ${this.authService.tokens.accessToken}`;
    }

    const requestClone = request.clone({
      setHeaders: {
        // Default headers
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
        // Additional headers / overwrites
        ...headers,
      },
    });

    // Send request
    return requestClone;
  }

  sendRefreshTokenRequest() {
    this.authService.refreshToken().subscribe();
  }
}
