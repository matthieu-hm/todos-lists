export class ListNotDeletedException extends Error {
  constructor(message = 'List not deleted') {
    super(message);
  }
}
