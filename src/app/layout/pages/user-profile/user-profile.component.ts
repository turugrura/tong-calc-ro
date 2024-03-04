import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, Profile } from 'src/app/api-services';
import { LayoutService } from '../../service/app.layout.service';
import { Subscription, catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [MessageService],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profile: Profile;
  isLoading = false;
  subs: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly layoutService: LayoutService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.subscribeLogin();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  subscribeLogin() {
    this.subs = this.authService.loggedInEvent$.subscribe((_isLoggin) => {
      this.setMyProfile();
    });
  }

  setMyProfile() {
    this.profile = this.authService.getProfile();
  }

  updateMyProfile(name: string) {
    if (!name) return;

    this.isLoading = true;
    this.authService
      .updateMyProfile({ name: name.substring(0, 100) })
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Proefile was update.',
          });
        }),
        catchError((err) => {
          console.log({ err });
          this.messageService.add({
            severity: 'error',
            summary: err?.error?.message || err?.statusText || 'server error',
          });
          return of(1);
        }),
      )
      .subscribe(() => {
        this.setMyProfile();
        this.isLoading = false;
      });
  }

  get visible(): boolean {
    return this.layoutService.state.myProfileVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.myProfileVisible = _val;
  }
}
