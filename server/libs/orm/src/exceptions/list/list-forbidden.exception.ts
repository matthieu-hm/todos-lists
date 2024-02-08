export class ListForbiddenException extends Error {
  constructor(message = 'Forbidden action for the list') {
    super(message);
  }
}
