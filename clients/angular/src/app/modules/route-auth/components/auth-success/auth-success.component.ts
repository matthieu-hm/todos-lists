import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-auth-success',
  templateUrl: './auth-success.component.html',
  styleUrls: ['./auth-success.component.scss'],
})
export class AuthSuccessComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe({
      next: (queryParams) => {
        this.authService.setTokens(queryParams['access_token'], queryParams['refresh_token']);

        if (queryParams['redirect_uri']) {
          this.router.navigateByUrl(queryParams['redirect_uri']);
        } else {
          this.router.navigate(['/']);
        }
      },
    });
  }
}
