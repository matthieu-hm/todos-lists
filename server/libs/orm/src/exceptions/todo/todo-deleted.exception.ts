export class TodoDeletedException extends Error {
  constructor(message = 'Todo deleted') {
    super(message);
  }
}
