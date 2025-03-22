import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/api-services';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
    standalone: false
})
export class AuthComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    const authCode = this.route.snapshot.queryParamMap.get('auth_code');
    if (authCode) {
      this.login(authCode);
    }
  }

  login(authCode: string) {
    this.authService.login(authCode).subscribe({
      next: () => {
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['..'], { relativeTo: this.route });
      },
    });
  }
}
