import {
  Controller, Get, Logger,
} from '@nestjs/common';
import { CurrentUser } from '@app/auth';
import {
  AuthTokensService, ListsService, User,
} from '@app/orm';

@Controller('users/me')
export class UsersMeController {
  private logger = new Logger(UsersMeController.name);

  constructor(
    private readonly authTokensService: AuthTokensService,
    private readonly listsService: ListsService,
  ) {}

  @Get()
  async getMe(
    @CurrentUser() currentUser: User,
  ) {
    this.logger.verbose('getMe()');

    return currentUser;
  }

  @Get('auth-tokens')
  async getAuthTokens(
    @CurrentUser() currentUser: User,
  ) {
    this.logger.verbose('getAuthTokens()');

    return this.authTokensService.findManyByUser(currentUser);
  }

  @Get('todos-lists')
  async getTodosLists(
    @CurrentUser() currentUser: User,
  ) {
    this.logger.verbose('getTodosLists()');

    return this.listsService.findManyByUser(currentUser.id, { todos: true });
  }
}
