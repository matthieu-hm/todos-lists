import {
  Controller, Get, Logger, Query, Redirect, UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CurrentAuthToken, RefreshTokenGuard, SkipAuth,
} from '@app/auth';
import { AuthTokenDeletedException, AuthTokenNotFoundException, AuthTokensService } from '@app/orm';
import { IAppConfig } from '@app/configuration';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  private appConfig = this.configService.getOrThrow<IAppConfig>('app');

  constructor(
    private readonly configService: ConfigService,
    private readonly authTokensService: AuthTokensService,
  ) {}

  @Get('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @SkipAuth()
  async refreshToken(
    @CurrentAuthToken() authToken,
  ) {
    this.logger.verbose('refreshToken()');

    const freshAuthToken = await this.authTokensService.refresh(authToken);

    return {
      access_token: freshAuthToken.accessToken,
      refresh_token: freshAuthToken.refreshToken,
    };
  }

  @Get('logout')
  @Redirect()
  @SkipAuth()
  async logout(
    @Query('access_token') accessToken?: string,
    @Query('refresh_token') refreshToken?: string,
    @Query('redirect_uri') redirectUri?: string,
  ) {
    this.logger.verbose('logout()');

    if (accessToken) {
      await this.authTokensService
        .findOneByAccessToken(accessToken)
        .then((authToken) => this.authTokensService.softDelete(authToken.id))
        .catch((err) => {
          if (
            err instanceof AuthTokenNotFoundException
            || err instanceof AuthTokenDeletedException
          ) {
            return null;
          }
          throw err;
        });
    }

    if (refreshToken) {
      await this.authTokensService
        .findOneByRefreshToken(refreshToken)
        .then((authToken) => this.authTokensService.softDelete(authToken.id))
        .catch((err) => {
          if (
            err instanceof AuthTokenNotFoundException
            || err instanceof AuthTokenDeletedException
          ) {
            return null;
          }
          throw err;
        });
    }

    // Use redirectUri only if it's front app
    const redirectUriIsFrontUrl = redirectUri && redirectUri.indexOf(this.appConfig.front.url) === 0;

    if (redirectUriIsFrontUrl) {
      this.logger.verbose(`REDIRECT: ${redirectUri}`);
      return { url: redirectUri };
    }

    this.logger.verbose(`REDIRECT: ${this.appConfig.front.url}`);
    return { url: this.appConfig.front.url };
  }
}
