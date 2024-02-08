import { EntityDeletedException } from '../core';

export class AuthTokenDeletedException extends EntityDeletedException {
  constructor() {
    super('Auth token deleted');
  }
}
