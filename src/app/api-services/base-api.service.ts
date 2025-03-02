import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse } from './models';
import { Unauthorized } from '../app-errors';

const BASE_URL = environment.roBackendUrl;
const REFRESH_TOKEN_KEY = 'refreshToken';

export abstract class BaseAPIService {
  protected readonly API = {
    base: BASE_URL,

    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/auth/logout`,
    refreshToken: `${BASE_URL}/auth/refresh_token`,

    getMyProfile: `${BASE_URL}/auth/profile`,

    getMyEntirePreset: `${BASE_URL}/presets/entire`,

    getMyPreset: `${BASE_URL}/presets`,
    getMyPresets: `${BASE_URL}/presets`,
    createMyPreset: `${BASE_URL}/presets`,
    bulkCreateMyPresets: `${BASE_URL}/presets/bulk`,

    likePresetTags: `${BASE_URL}/presets/tags`,
    sharedPresets: `${BASE_URL}/presets/tags/search`,
  } as const;

  protected abstract readonly http: HttpClient;
  protected abstract readonly jwtHelper: JwtHelperService;

  private getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  protected isUnauthorizedErr(err: any) {
    return err?.message === 'Unauthorized' || err?.status === 401;
  }

  protected handleUnauthErr() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    return throwError(() => new Unauthorized());
  }

  protected storeToken(res: LoginResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
  }

  protected refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return this.handleUnauthErr();

    return this.http
      .post<LoginResponse>(`${this.API.refreshToken}`, { refreshToken })
      .pipe(tap((res) => this.storeToken(res)));
  }

  private getAuthHeaders() {
    return {
      headers: {
        authorization: `bearer ${this.jwtHelper.tokenGetter()}`,
      },
    };
  }

  protected get<T = any>(url: string, includeAuth = true) {
    let ob: Observable<T>;
    if (includeAuth) {
      const rfToken = this.jwtHelper.isTokenExpired() ? this.refreshToken() : of(null);
      ob = rfToken.pipe(
        switchMap(() => {
          return this.http.get<T>(url, this.getAuthHeaders());
        }),
      );
    } else {
      ob = this.http.get<T>(url);
    }

    return ob.pipe(
      catchError((err) => {
        if (this.isUnauthorizedErr(err)) {
          return this.handleUnauthErr();
        } else {
          console.error({ err });
        }

        return throwError(() => err);
      }),
    );
  }

  protected post<T = any, K = any>(url: string, body: K, includeAuth = true) {
    let ob: Observable<T>;
    if (includeAuth) {
      const rfToken = this.jwtHelper.isTokenExpired() ? this.refreshToken() : of(null);
      ob = rfToken.pipe(
        switchMap(() => {
          return this.http.post<T>(url, body, this.getAuthHeaders());
        }),
      );
    } else {
      ob = this.http.post<T>(url, body);
    }

    return ob.pipe(
      catchError((err) => {
        if (this.isUnauthorizedErr(err)) {
          return this.handleUnauthErr();
        } else {
          console.error({ err });
        }

        return throwError(() => err);
      }),
    );
  }

  protected delete<T = any>(url: string, includeAuth = true) {
    let ob: Observable<T>;
    if (includeAuth) {
      const rfToken = this.jwtHelper.isTokenExpired() ? this.refreshToken() : of(null);
      ob = rfToken.pipe(
        switchMap(() => {
          return this.http.delete<T>(url, this.getAuthHeaders());
        }),
      );
    } else {
      ob = this.http.delete<T>(url);
    }

    return ob.pipe(
      catchError((err) => {
        if (this.isUnauthorizedErr(err)) {
          return this.handleUnauthErr();
        } else {
          console.error({ err });
        }

        return throwError(() => err);
      }),
    );
  }
}
