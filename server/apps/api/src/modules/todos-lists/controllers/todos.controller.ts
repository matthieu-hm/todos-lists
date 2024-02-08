import {
  Body, Controller, Logger, Param, Put, UseGuards,
} from '@nestjs/common';
import { Todo, TodosService } from '@app/orm';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { TodoListOwnerGuard } from '../guards/todo-list-owner.guard';

@Controller('todos')
export class TodosController {
  private logger = new Logger(TodosController.name);

  constructor(
    private readonly todosService: TodosService,
  ) {}

  @Put(':todoId')
  @UseGuards(TodoListOwnerGuard)
  async updateTodo(
    @Param('todoId') todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    this.logger.verbose('updateTodo()');

    return this.todosService.update(todoId, updateTodoDto);
  }

  @Put(':todoId/done')
  @UseGuards(TodoListOwnerGuard)
  async markAsDone(
    @Param('todoId') todoId: string,
  ): Promise<Todo> {
    this.logger.verbose('updateTodo()');

    return this.todosService.markAsDone(todoId);
  }

  @Put(':todoId/not-done')
  @UseGuards(TodoListOwnerGuard)
  async markAsNotDone(
    @Param('todoId') todoId: string,
  ): Promise<Todo> {
    this.logger.verbose('updateTodo()');

    return this.todosService.markAsNotDone(todoId);
  }
}
