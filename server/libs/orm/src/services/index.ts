import { AuthTokensService } from './auth-tokens.service';
import { UsersService } from './users.service';

export * from './auth-tokens.service';
export * from './users.service';

export const services = [
  AuthTokensService,
  UsersService,
];
