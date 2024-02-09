import { OAuthProviders } from '@app/shared';
import { List } from './list.model';

export class User {
  id!: string;

  oAuthProvider!: OAuthProviders;

  oAuthId!: string;

  firstName?: string;

  lastName?: string;

  preferredUsername?: string;

  email?: string;

  phoneNumber?: string;

  lists?: List[];

  createdAt!: string;

  updatedAt!: string;

  constructor(userData: Partial<User>) {
    Object.assign(this, userData);

    if (userData.lists) {
      this.lists = userData.lists.map((list) => new List(list));
    }
  }

  get fullName(): string {
    return [this.firstName, this.lastName].filter((str) => !!str).join(' ');
  }
}
