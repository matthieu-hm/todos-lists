import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout-navbar-user-unauthenticated',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './layout-navbar-user-unauthenticated.component.html',
  styleUrls: ['./layout-navbar-user-unauthenticated.component.scss'],
})
export class LayoutNavbarUserUnauthenticatedComponent {}
