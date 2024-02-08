import {
  ExecutionContext,
  Injectable,
  CanActivate,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import * as isUUID from 'is-uuid';
import { ListsService, TodosService } from '@app/orm';

@Injectable()
export class TodoListOwnerGuard implements CanActivate {
  private logger = new Logger(TodoListOwnerGuard.name);

  constructor(
    private listsService: ListsService,
    private todosService: TodosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.verbose('canActivate()');

    const request = context.switchToHttp().getRequest();
    const {
      todoId,
    } = request.params;
    const { user } = request;

    if (!isUUID.v4(todoId)) {
      throw new NotFoundException();
    }

    try {
      const todo = await this.todosService.findOneById(todoId);
      await this.listsService.checkOwnership(todo.listId, user.id);
    } catch (error) {
      this.logger.verbose('canActivate() -> 404');
      throw new NotFoundException();
    }

    return true;
  }
}
