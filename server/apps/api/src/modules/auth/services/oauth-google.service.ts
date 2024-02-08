import { IAppConfig, IOAuthConfig } from '@app/configuration';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOAuthOptions } from '../interfaces';
import { OauthService } from './oauth.service';

@Injectable()
export class OauthGoogleService extends OauthService {
  constructor(configService: ConfigService) {
    const appConfig = configService.getOrThrow<IAppConfig>('app');
    const oauthConfig = configService.getOrThrow<IOAuthConfig>('oauth');

    const oauthOptions: IOAuthOptions = {
      name: 'google',
      issuer: oauthConfig.google.issuer,
      clientId: oauthConfig.google.clientId,
      clientSecret: oauthConfig.google.clientSecret,
      redirectUri: `${appConfig.api.url}oauth/google/callback`,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid',
      ],
      authorizationUrlExtraParams: {
        access_type: 'offline',
        include_granted_scopes: true,
      },
    };

    super(
      oauthOptions,
      new Logger(OauthGoogleService.name),
    );
  }
}
