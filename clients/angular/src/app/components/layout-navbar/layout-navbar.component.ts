import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { LayoutNavbarUserAuthenticatedComponent } from '../layout-navbar-user-authenticated/layout-navbar-user-authenticated.component';
import { LayoutNavbarUserUnauthenticatedComponent } from '../layout-navbar-user-unauthenticated/layout-navbar-user-unauthenticated.component';
import { LayoutNavbarUserAuthenticatedSmComponent } from '../layout-navbar-user-authenticated-sm/layout-navbar-user-authenticated-sm.component';

@Component({
  selector: 'app-layout-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgTemplateOutlet,
    LayoutNavbarUserAuthenticatedComponent,
    LayoutNavbarUserAuthenticatedSmComponent,
    LayoutNavbarUserUnauthenticatedComponent,
  ],
  templateUrl: './layout-navbar.component.html',
  styleUrls: ['./layout-navbar.component.scss'],
})
export class LayoutNavbarComponent {
  constructor(private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
