import { EntityNotFoundException } from '../core';

export class AuthTokenNotFoundException extends EntityNotFoundException {
  constructor() {
    super('Auth token not found');
  }
}
