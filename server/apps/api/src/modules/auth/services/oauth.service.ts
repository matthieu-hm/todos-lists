import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import {
  Client, generators, Issuer, TokenSet,
} from 'openid-client';
import { IOAuthOptions } from '../interfaces';

@Injectable()
export abstract class OauthService {
  constructor(
    private readonly oauthOptions: IOAuthOptions,
    private readonly logger: Logger,
  ) {}

  async getClient(client?: Client): Promise<Client> {
    if (client) {
      this.logger.verbose('getClient() [skipped]');
      return client;
    }

    this.logger.verbose('getClient()');

    const issuer = await this.getIssuer();

    return new issuer.Client({
      client_id: this.oauthOptions.clientId,
      client_secret: this.oauthOptions.clientSecret,
      redirect_uri: this.oauthOptions.redirectUri,
    });
  }

  async generateOAuthAuthorizeUrl(req: Request, c?: Client): Promise<string> {
    this.logger.verbose('generateOAuthAuthorizeUrl()');

    const client = await this.getClient(c);

    const oauthSessionData = {
      state: generators.state(),
      nonce: generators.nonce(),
      referer: req.headers.referer,
    };
    this.setOAuthSession(req, oauthSessionData);

    const requestedPrompt: string = (<string>req?.query?.['prompt']) || '';

    return client.authorizationUrl({
      ...req.query,
      ...this.oauthOptions.authorizationUrlExtraParams,
      state: oauthSessionData.state,
      nonce: oauthSessionData.nonce,
      response_type: 'code',
      grant_types: 'authorization_code',
      scope: this.oauthOptions.scope.join(' '),
      prompt: this.getOAuthAuthorizePrompt(requestedPrompt) || 'none',
    });
  }

  async fetchOAuthTokensFromCallback(req: Request, c?: Client): Promise<TokenSet> {
    this.logger.verbose('fetchOAuthTokensFromCallback()');

    const oAuthSession = this.getOAuthSession(req);

    if (!oAuthSession || !req.query?.['code']) {
      throw new UnauthorizedException();
    }

    const client = await this.getClient(c);

    try {
      const tokenSet = await client.callback(
        this.oauthOptions.redirectUri,
        client.callbackParams(req),
        {
          state: oAuthSession?.['state'],
          nonce: oAuthSession?.['nonce'],
        },
      );
      this.clearOAuthSession(req);

      return tokenSet;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
  }

  async fetchOAuthUserInfoEndpoint(accessToken: string, tokenType = 'Bearer', c?: Client) {
    this.logger.verbose('fetchOAuthUserInfoEndpoint()');

    const client = await this.getClient(c);
    return client.userinfo(accessToken, { tokenType });
  }

  async generateOAuthLogoutUrl(c?: Client): Promise<string> {
    this.logger.verbose('generateOAuthLogoutUrl()');

    try {
      const client = await this.getClient(c);
      return client.endSessionUrl();
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
  }

  getOAuthSession(req: Request): { [key: string]: string } | undefined {
    this.logger.verbose('getOAuthSession()');

    const oAuthSessionKey = this.getOAuthSessionKey();
    return req.session?.[oAuthSessionKey];
  }

  private getOAuthSessionKey(): string {
    this.logger.verbose('getOAuthSessionKey()');

    return `oidc:${this.oauthOptions.name}`;
  }

  private setOAuthSession(
    req: Request,
    data: { [key: string]: string | number | boolean | null | undefined },
    replace = true,
  ) {
    this.logger.verbose('setOAuthSession()');

    const oAuthSessionKey = this.getOAuthSessionKey();

    if (replace) {
      req.session[oAuthSessionKey] = data;
    } else {
      req.session[oAuthSessionKey] = {
        ...req.session?.[oAuthSessionKey],
        ...data,
      };
    }
  }

  private clearOAuthSession(req: Request) {
    this.logger.verbose('clearOAuthSession()');

    const oAuthSessionKey = this.getOAuthSessionKey();
    delete req.session?.[oAuthSessionKey];
  }

  private async getIssuer(): Promise<Issuer<Client>> {
    this.logger.verbose('getIssuer()');

    return Issuer.discover(this.oauthOptions.issuer);
  }

  private getOAuthAuthorizePrompt(prompt?: string): string | null {
    this.logger.verbose('getOAuthAuthorizePrompt()');

    const allowedPrompts = [
      'none',
      'login',
      'consent',
      'select_account',
    ];

    if (prompt && allowedPrompts.includes(prompt)) {
      return prompt;
    }

    return null;
  }
}
