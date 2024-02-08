import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersMeApiService } from 'src/app/modules/api';

@Component({
  selector: 'app-layout-navbar-user-authenticated-sm',
  standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe],
  templateUrl: './layout-navbar-user-authenticated-sm.component.html',
  styleUrls: ['./layout-navbar-user-authenticated-sm.component.scss'],
})
export class LayoutNavbarUserAuthenticatedSmComponent {
  currentUser$ = this.usersMeApiService.currentUser$;

  constructor(private usersMeApiService: UsersMeApiService) {}
}
