import { AuthToken } from './auth-token.entity';
import { User } from './user.entity';

export * from './auth-token.entity';
export * from './user.entity';

export const entities = [
  AuthToken,
  User,
];
