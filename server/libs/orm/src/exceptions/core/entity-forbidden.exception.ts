export class EntityForbiddenException extends Error {
  constructor(message = 'Forbidden action for the entity') {
    super(message);
  }
}
