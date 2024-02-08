import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RouteHomeComponent } from './route-home.component';

const routes: Routes = [
  {
    path: '',
    component: RouteHomeComponent,
  },
];

@NgModule({
  declarations: [RouteHomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class RouteHomeModule {}
