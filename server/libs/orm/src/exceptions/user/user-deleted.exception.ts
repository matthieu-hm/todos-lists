import { EntityDeletedException } from '../core';

export class UserDeletedException extends EntityDeletedException {
  constructor() {
    super('User deleted');
  }
}
