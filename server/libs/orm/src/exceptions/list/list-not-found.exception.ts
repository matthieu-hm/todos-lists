export class ListNotFoundException extends Error {
  constructor(message = 'List not found') {
    super(message);
  }
}
