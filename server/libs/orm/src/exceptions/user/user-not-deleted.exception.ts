import { EntityNotDeletedException } from '../core';

export class UserNotDeletedException extends EntityNotDeletedException {
  constructor() {
    super('User not deleted');
  }
}
