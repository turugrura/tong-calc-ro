import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse, Profile } from './models';
import { ReplaySubject, catchError, of, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BaseAPIService } from './base-api.service';

@Injectable()
export class AuthService extends BaseAPIService {
  private profileEvent = new ReplaySubject<Profile>(1);
  private profile: Profile;
  public profileEventObs$ = this.profileEvent.asObservable();

  private loggedInSubject = new ReplaySubject<boolean>(1);
  public loggedInEvent$ = this.loggedInSubject.asObservable();
  public isLoggedIn = false;

  constructor(protected readonly http: HttpClient, protected readonly jwtHelper: JwtHelperService) {
    super();
    this.getMyProfile().subscribe();
    this.loggedInEvent$.subscribe((isLoggedIn) => (this.isLoggedIn = isLoggedIn));
  }

  login(authorizationCode: string) {
    this.profile = undefined;

    return this.post<LoginResponse>(`${this.API.login}`, { authorizationCode }, false).pipe(
      tap((res) => this.storeToken(res)),
      switchMap(() => this.getMyProfile()),
    );
  }

  logout() {
    return this.post<LoginResponse>(`${this.API.logout}`, {}).subscribe({
      next: () => {
        console.log('logout');
      },
      error: (err) => {
        console.error({ err });
      },
      complete: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.storeProfile({} as any);
        this.loggedInSubject.next(false);
      },
    });
  }

  getMyProfile() {
    const getProfileReq = this.get<Profile>(this.API.getMyProfile).pipe(
      tap((res) => this.storeProfile(res)),
      tap((res) => {
        if (res?.id) {
          this.loggedInSubject.next(true);
        }
      }),
      catchError(() => {
        this.loggedInSubject.next(false);
        return of(null);
      }),
    );

    return getProfileReq;
  }

  private storeProfile(profile: Profile) {
    this.profile = { ...profile };
    this.profileEvent.next(this.profile);
  }

  getProfile() {
    return this.profile;
  }
}
