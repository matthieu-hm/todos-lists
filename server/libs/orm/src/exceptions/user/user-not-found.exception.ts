import { EntityNotFoundException } from '../core';

export class UserNotFoundException extends EntityNotFoundException {
  constructor() {
    super('User not found');
  }
}
