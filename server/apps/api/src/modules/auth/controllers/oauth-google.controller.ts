import {
  Controller, Get, Logger, Query, Redirect, Req, UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { SkipAuth } from '@app/auth';
import { UsersService, AuthTokensService } from '@app/orm';
import { IAppConfig } from '@app/configuration';
import { ExternalOAuthProvidersEnum } from '@app/shared';
import { OauthGoogleService } from '../services/oauth-google.service';

@Controller('oauth/google')
export class OauthGoogleController {
  private logger = new Logger(OauthGoogleController.name);

  private appConfig = this.configService.getOrThrow<IAppConfig>('app');

  constructor(
    private readonly configService: ConfigService,
    private readonly oauthGoogleService: OauthGoogleService,
    private readonly usersService: UsersService,
    private readonly authTokensService: AuthTokensService,
  ) {}

  @Get()
  @Redirect()
  @SkipAuth()
  async authorize(
    @Req() req: Request,
    @Query('remember') remember?: boolean,
    @Query('redirect_uri') redirectUri?: string,
  ) {
    this.logger.verbose('authorize()');

    const redirectUriIsFrontUrl = redirectUri && redirectUri.indexOf(this.appConfig.front.url) === 0;

    req.session['auth:authorize'] = {
      remember: !!remember,
      redirectUri: redirectUriIsFrontUrl ? redirectUri : null,
    };

    const authorizationUrl = await this.oauthGoogleService.generateOAuthAuthorizeUrl(req);

    this.logger.verbose(`REDIRECT: ${authorizationUrl}`);
    return { url: authorizationUrl };
  }

  @Get('callback')
  @Redirect()
  @SkipAuth()
  async callback(
    @Req() req: Request,
    @Query('error') errorQueryParam: string,
  ) {
    this.logger.verbose('callback()');

    if (['login_required', 'interaction_required'].includes(errorQueryParam)) {
      req.query['prompt'] = 'login';

      if (req.query?.['error']) {
        delete req.query['error'];
      }
      if (req.query?.['error_subtype']) {
        delete req.query['error_subtype'];
      }

      const oauthAuthorizeUrl = await this.oauthGoogleService.generateOAuthAuthorizeUrl(req);

      this.logger.verbose(`REDIRECT: ${oauthAuthorizeUrl}`);
      return { url: oauthAuthorizeUrl };
    }

    const oauthSession = this.oauthGoogleService.getOAuthSession(req);

    if (!oauthSession || !req.query?.['code']) {
      throw new UnauthorizedException();
    }

    const oauthGoogleClient = await this.oauthGoogleService.getClient();

    const tokenSet = await this.oauthGoogleService.fetchOAuthTokensFromCallback(req, oauthGoogleClient);
    if (!tokenSet.access_token) {
      throw new UnauthorizedException();
    }

    const oAuthUserInfo = await this.oauthGoogleService
      .fetchOAuthUserInfoEndpoint(tokenSet.access_token, tokenSet.token_type, oauthGoogleClient);

    const user = await this.usersService.findOneOrCreateForOAuthProvider(
      ExternalOAuthProvidersEnum.GOOGLE,
      oAuthUserInfo.sub,
      {
        firstName: oAuthUserInfo.given_name,
        lastName: oAuthUserInfo.family_name,
        preferredUsername: oAuthUserInfo.preferred_username,
        email: oAuthUserInfo.email,
      },
    );

    const authToken = await this.authTokensService.create(
      user.id,
      req.session?.['auth:authorize']?.remember || false,
      req.ip,
      req.headers['user-agent'] || '',
    );

    const urlObj = new URL(`${this.appConfig.front.url}auth/success`);
    urlObj.searchParams.append('access_token', authToken.accessToken || '');
    urlObj.searchParams.append('refresh_token', authToken.refreshToken || '');

    if (req.session?.['auth:authorize']?.redirectUri) {
      urlObj.searchParams.append('redirect_uri', req.session?.['auth:authorize']?.redirectUri);
    }

    const loginSuccessUrl = urlObj.toString();

    this.logger.verbose(`REDIRECT: ${loginSuccessUrl}`);
    return { url: loginSuccessUrl };
  }
}
