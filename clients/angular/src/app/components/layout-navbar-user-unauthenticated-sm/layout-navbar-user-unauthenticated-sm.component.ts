import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BtnConnectGoogleComponent } from '../btn-connect-google/btn-connect-google.component';

@Component({
  selector: 'app-layout-navbar-user-unauthenticated-sm',
  standalone: true,
  imports: [ReactiveFormsModule, BtnConnectGoogleComponent],
  templateUrl: './layout-navbar-user-unauthenticated-sm.component.html',
  styleUrls: ['./layout-navbar-user-unauthenticated-sm.component.scss'],
})
export class LayoutNavbarUserUnauthenticatedSmComponent {
  rememberMeFormControl = new FormControl(false);
}
