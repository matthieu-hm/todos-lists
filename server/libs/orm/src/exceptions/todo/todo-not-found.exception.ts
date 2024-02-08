export class TodoNotFoundException extends Error {
  constructor(message = 'Todo not found') {
    super(message);
  }
}
