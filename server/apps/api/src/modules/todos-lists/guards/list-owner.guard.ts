import {
  ExecutionContext,
  Injectable,
  CanActivate,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import * as isUUID from 'is-uuid';
import { ListsService } from '@app/orm';

@Injectable()
export class ListOwnerGuard implements CanActivate {
  private logger = new Logger(ListOwnerGuard.name);

  constructor(
    private listsService: ListsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.verbose('canActivate()');

    const request = context.switchToHttp().getRequest();
    const {
      listId,
    } = request.params;
    const { user } = request;

    if (!isUUID.v4(listId)) {
      throw new NotFoundException();
    }

    try {
      await this.listsService.checkOwnership(listId, user.id);
    } catch (error) {
      this.logger.verbose('canActivate() -> 404');
      throw new NotFoundException();
    }

    return true;
  }
}
