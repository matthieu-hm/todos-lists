import {
  Body,
  Controller, Logger, Param, Post, Put, UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@app/auth';
import {
  List, ListsService, Todo, TodosService, User,
} from '@app/orm';
import { CreateListDto } from '../dtos/create-list.dto';
import { UpdateListDto } from '../dtos/update-list.dto';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { ListOwnerGuard } from '../guards/list-owner.guard';

@Controller('lists')
export class ListsController {
  private logger = new Logger(ListsController.name);

  constructor(
    private readonly listsService: ListsService,
    private readonly todosService: TodosService,
  ) {}

  @Post()
  async createList(
    @CurrentUser() currentUser: User,
    @Body() createListDto: CreateListDto,
  ): Promise<List> {
    this.logger.verbose('createList()');

    return this.listsService.create(createListDto, currentUser);
  }

  @Put(':listId')
  @UseGuards(ListOwnerGuard)
  async updateList(
    @Param('listId') listId: string,
    @Body() updateListDto: UpdateListDto,
  ): Promise<List> {
    this.logger.verbose('updateList()');

    return this.listsService.update(listId, updateListDto);
  }

  @Post(':listId/todo')
  @UseGuards(ListOwnerGuard)
  async createTodo(
    @Param('listId') listId: string,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    this.logger.verbose('createTodo()');

    const list = await this.listsService.findOneById(listId);

    return this.todosService.create(createTodoDto, list);
  }
}
