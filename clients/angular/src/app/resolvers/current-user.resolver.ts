import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UsersMeApiService, User } from 'src/app/modules/api';

export const currentUserResolver: ResolveFn<User | null> = () => {
  const usersMeApiService = inject(UsersMeApiService);

  return usersMeApiService.getCurrentUser();
};
