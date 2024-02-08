import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthLogoutComponent, AuthSuccessComponent } from './components';

const routes: Routes = [
  {
    path: 'success',
    component: AuthSuccessComponent,
  },
  {
    path: 'logout',
    component: AuthLogoutComponent,
  },
];

@NgModule({
  declarations: [AuthSuccessComponent, AuthLogoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class RouteAuthModule {}
