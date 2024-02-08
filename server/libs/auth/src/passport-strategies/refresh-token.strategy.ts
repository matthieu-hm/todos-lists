import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Strategy } from 'passport-http-bearer';
import { UAParser } from 'ua-parser-js';
import { AuthToken, AuthTokenNotFoundException, AuthTokensService } from '@app/orm';
import { IAuthConfig } from '@app/configuration';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'bearer-refresh-token') {
  private logger = new Logger(RefreshTokenStrategy.name);

  private authConfig = this.configService.getOrThrow<IAuthConfig>('auth');

  constructor(
    private authTokensService: AuthTokensService,
    private configService: ConfigService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req: Request, refreshToken: string): Promise<AuthToken> {
    this.logger.verbose('validate()');

    const authToken = await this.authTokensService
      .findOneByRefreshToken(refreshToken, false, true)
      .catch((err) => {
        if (err instanceof AuthTokenNotFoundException) {
          this.logger.verbose('validate() [not found/refreshed/revoked]');
          throw new UnauthorizedException();
        }

        throw err;
      });

    const now = new Date();
    const isExpired = now >= authToken.refreshTokenExpiredAt;
    if (isExpired) {
      this.logger.verbose('validate() [expired]');

      await this.authTokensService.softDelete(authToken.id);

      throw new UnauthorizedException();
    }

    if (this.authConfig.checkIpConsistency) {
      if (authToken.ip !== req.ip) {
        this.logger.verbose('validate() [IP changed]');

        throw new UnauthorizedException();
      }
    }

    if (this.authConfig.checkOsAndBrowserConsistency) {
      const uaParser = new UAParser();
      uaParser.setUA(req.headers['user-agent'] || '');

      if (authToken.os !== uaParser.getOS().name || authToken.browser !== uaParser.getBrowser().name) {
        this.logger.verbose('validate() [os/browser changed]');

        throw new UnauthorizedException();
      }
    }

    return authToken;
  }
}
