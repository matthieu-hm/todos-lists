import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BtnConnectGoogleComponent, LayoutComponent } from 'src/app/components';

import { AuthLogoutComponent, AuthSuccessComponent, AuthSignupComponent } from './components';
import { AuthSigninComponent } from './components/auth-signin/auth-signin.component';

const routes: Routes = [
  {
    path: 'success',
    component: AuthSuccessComponent,
  },
  {
    path: 'logout',
    component: AuthLogoutComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'signup',
        component: AuthSignupComponent,
      },
      {
        path: 'signin',
        component: AuthSigninComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [AuthSuccessComponent, AuthLogoutComponent, AuthSignupComponent, AuthSigninComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    LayoutComponent,
    BtnConnectGoogleComponent,
  ],
})
export class RouteAuthModule {}
