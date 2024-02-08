import { OAuthProviders } from '@app/shared';

export class User {
  id!: string;

  oAuthProvider!: OAuthProviders;

  oAuthId!: string;

  firstName?: string;

  lastName?: string;

  preferredUsername?: string;

  email?: string;

  phoneNumber?: string;

  createdAt!: string;

  updatedAt!: string;

  constructor(userData: Partial<User>) {
    Object.assign(this, userData);
  }

  get fullName(): string {
    return [this.firstName, this.lastName].filter((str) => !!str).join(' ');
  }
}
