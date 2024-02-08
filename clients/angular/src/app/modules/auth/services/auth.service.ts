import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject, catchError, of, switchMap, take, tap, throwError,
} from 'rxjs';
import { ExternalOAuthProvidersEnum } from '@app/shared';
import { Environment } from 'src/app/modules/env';

@Injectable()
export class AuthService {
  isRefreshTokenPending$ = new BehaviorSubject(false);

  constructor(
    private environment: Environment,
    private httpClient: HttpClient,
  ) {}

  get accessTokenKey(): string {
    return 'accessToken';
  }

  get refreshTokenKey(): string {
    return 'refreshToken';
  }

  get tokens() {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  getAuthorizeUrl(oauthProvider: ExternalOAuthProvidersEnum, remember = false) {
    switch (oauthProvider) {
      case ExternalOAuthProvidersEnum.GOOGLE:
        return this.handleRememberOptionAuthorizeUrl(`${this.environment.apiUrl}oauth/google`, remember);
      default:
        throw new Error('OAuthProvider not implemented');
    }
  }

  getRefreshTokenUrl() {
    return `${this.environment.apiUrl}auth/refresh-token`;
  }

  isAuthenticated(): boolean {
    const authTokens = this.tokens;

    return !!authTokens.accessToken || !!authTokens.refreshToken;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  refreshToken() {
    return this.isRefreshTokenPending$.pipe(
      take(1),
      switchMap((isRefreshTokenPending) => {
        if (isRefreshTokenPending) {
          // Token is already refreshing: ignore
          return of({});
        }
        return this.sendRefreshTokenRequest();
      }),
    );
  }

  logout(): void {
    const logoutUrl = this.getLogoutUrl();

    this.clearTokens();

    // eslint-disable-next-line no-restricted-globals
    location.href = logoutUrl;
  }

  private sendRefreshTokenRequest() {
    this.isRefreshTokenPending$.next(true);
    const refreshTokenUrl = this.getRefreshTokenUrl();

    const headers: any = {};
    if (this.tokens.refreshToken) {
      headers.Authorization = `Bearer ${this.tokens.refreshToken}`;
    }

    return this.httpClient.get<{ access_token: string; refresh_token: string }>(
      refreshTokenUrl,
      { headers },
    )
      .pipe(
        tap((tokens) => {
          if (tokens?.access_token) {
            this.setAccessToken(tokens.access_token);
          }
          if (tokens?.refresh_token) {
            this.setRefreshToken(tokens.refresh_token);
          }

          // Now that tokens are refreshed mark refresh token process as NOT PENDING
          // allow process waiting to continue (api-bearer.interceptor)
          this.isRefreshTokenPending$.next(false);
        }),
        catchError((error) => {
          this.clearTokens();

          this.reloadPage();

          // Never ending refresh token request because we reload the page
          // // this.isRefreshTokenPending$.next(false);

          return throwError(() => error);
        }),
      );
  }

  private setAccessToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.accessTokenKey);
  }

  private handleRememberOptionAuthorizeUrl(urlStr: string, remember = false) {
    const url = new URL(urlStr);

    if (remember) {
      url.searchParams.append('remember', '1');
    }

    return url;
  }

  private getLogoutUrl() {
    const urlObj = new URL(`${this.environment.apiUrl}auth/logout`);

    if (this.tokens.accessToken) {
      urlObj.searchParams.append('access_token', this.tokens.accessToken || '');
    }
    if (this.tokens.refreshToken) {
      urlObj.searchParams.append('refresh_token', this.tokens.refreshToken || '');
    }

    // eslint-disable-next-line no-restricted-globals
    urlObj.searchParams.append('redirect_uri', location.href);

    return urlObj.toString();
  }

  private reloadPage(): void {
    /* eslint-disable no-restricted-globals */
    /* eslint-disable no-self-assign */
    location.href = location.href;
    /* eslint-enable no-restricted-globals */
    /* eslint-enable no-self-assign */
  }
}
