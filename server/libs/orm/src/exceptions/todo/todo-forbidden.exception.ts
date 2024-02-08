export class TodoForbiddenException extends Error {
  constructor(message = 'Forbidden action for the todo') {
    super(message);
  }
}
