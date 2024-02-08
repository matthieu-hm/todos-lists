import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('bearer-refresh-token') {
  private logger = new Logger(RefreshTokenGuard.name);

  override canActivate(context: ExecutionContext) {
    this.logger.verbose('canActivate()');

    return super.canActivate(context);
  }
}
