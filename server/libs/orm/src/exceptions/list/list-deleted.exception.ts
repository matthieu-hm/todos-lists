export class ListDeletedException extends Error {
  constructor(message = 'List deleted') {
    super(message);
  }
}
