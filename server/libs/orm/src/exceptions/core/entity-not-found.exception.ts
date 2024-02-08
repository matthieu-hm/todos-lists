export class EntityNotFoundException extends Error {
  constructor(message = 'Entity not found') {
    super(message);
  }
}
