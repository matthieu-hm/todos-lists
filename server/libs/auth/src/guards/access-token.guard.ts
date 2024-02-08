import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SKIP_AUTH_KEY } from '../constants';

@Injectable()
export class AccessTokenGuard extends AuthGuard('bearer-access-token') {
  private logger = new Logger(AccessTokenGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    this.logger.verbose('canActivate()');

    const isPublic = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.verbose('canActivate() [@SkipAuth]');
      return true;
    }

    return super.canActivate(context);
  }
}
