import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RouteHomeComponent } from './route-home.component';
import { HomeAuthenticatedComponent, HomeUnauthenticatedComponent } from './components';
import { TodosListComponent } from './components/todos-list/todos-list.component';
import { TodoComponent } from './components/todo/todo.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: RouteHomeComponent,
  },
];

@NgModule({
  declarations: [
    RouteHomeComponent,
    HomeAuthenticatedComponent,
    HomeUnauthenticatedComponent,
    TodosListComponent,
    TodoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
})
export class RouteHomeModule {}
