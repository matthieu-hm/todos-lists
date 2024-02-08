export class TodoNotDeletedException extends Error {
  constructor(message = 'Todo not deleted') {
    super(message);
  }
}
