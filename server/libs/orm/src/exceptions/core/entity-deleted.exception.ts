export class EntityDeletedException extends Error {
  constructor(message = 'Entity deleted') {
    super(message);
  }
}
