import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtModel, LoginResponse, Profile } from './models';
import { ReplaySubject, of, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
  private readonly BASE_URL = environment.roBackendUrl;
  private profileEvent = new ReplaySubject<Profile>(1);
  private profile: Profile;
  public profileEventObs$ = this.profileEvent.asObservable();

  constructor(private readonly http: HttpClient, private readonly jwtHelper: JwtHelperService) {
    this.storeProfile();
  }

  login(authorizationCode: string) {
    this.profile = undefined;

    return this.http.post<LoginResponse>(`${this.BASE_URL}/login`, { authorizationCode }).pipe(
      tap((res) => this.storeToken(res)),
      tap(() => this.storeProfile()),
    );
  }

  logout() {
    this.profile = undefined;
    const accessToken = this.jwtHelper.tokenGetter();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.storeProfile();

    return this.http
      .post<LoginResponse>(
        `${this.BASE_URL}/me/logout`,
        {},
        {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        },
      )
      .subscribe({
        next: () => {
          console.log('logout');
        },
        error: (err) => {
          console.error({ err });
        },
      });
  }

  refreshToken() {
    const refreshToken = this.getRfToken();
    if (!refreshToken) return of(null);

    return this.http.post<LoginResponse>(`${this.BASE_URL}/refresh_token`, { refreshToken }).pipe(
      tap((res) => this.storeToken(res)),
      tap(() => this.storeProfile()),
    );
  }

  private storeProfile() {
    const t = this.jwtHelper.decodeToken() as JwtModel;
    this.profile = {
      userId: t?.jti,
      username: t?.iss,
    };

    this.profileEvent.next(this.profile);
  }

  getProfile() {
    return this.profile;
  }

  private getRfToken() {
    return localStorage.getItem('refreshToken');
  }

  private storeToken(res: LoginResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
  }
}
