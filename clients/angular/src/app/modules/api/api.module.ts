import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TodosListsApiService, UsersMeApiService } from './services';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    TodosListsApiService,
    UsersMeApiService,
  ],
})
export class ApiModule {}
