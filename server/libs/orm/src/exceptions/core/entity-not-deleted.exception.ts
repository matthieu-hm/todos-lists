export class EntityNotDeletedException extends Error {
  constructor(message = 'Entity not deleted') {
    super(message);
  }
}
