import { EntityForbiddenException } from '../core';

export class UserForbiddenException extends EntityForbiddenException {
  constructor(message = 'Forbidden action for User') {
    super(message);
  }
}
