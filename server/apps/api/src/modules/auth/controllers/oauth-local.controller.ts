import {
  BadRequestException, Body, Controller, Logger, Post, Req, UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SkipAuth } from '@app/auth';
import { UsersService, AuthTokensService, UserNotFoundException } from '@app/orm';
import { LocalOAuthProvidersEnum } from '@app/shared';
import { OAuthLocalSignUpDto } from '../dtos/oauth-local-sign-up.dto';
import { OAuthLocalSignInDto } from '../dtos/oauth-local-sign-in.dto';

@Controller('oauth/local')
export class OauthLocalController {
  private logger = new Logger(OauthLocalController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authTokensService: AuthTokensService,
  ) {}

  @Post('signup')
  @SkipAuth()
  async signUp(
    @Req() req: Request,
    @Body() dto: OAuthLocalSignUpDto,
  ) {
    this.logger.verbose('signUp()');

    const userAlreadyExist = await this.usersService.existByEmail(dto.email);

    if (userAlreadyExist) {
      throw new BadRequestException();
    }

    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      oAuthProvider: LocalOAuthProvidersEnum.LOCAL,
    });

    const authToken = await this.authTokensService.create(
      user.id,
      req.session?.['auth:authorize']?.remember || false,
      req.ip,
      req.headers['user-agent'] || '',
    );

    return {
      access_token: authToken.accessToken || '',
      refresh_token: authToken.refreshToken || '',
    };
  }

  @Post('signin')
  @SkipAuth()
  async signIn(
    @Req() req: Request,
    @Body() dto: OAuthLocalSignInDto,
  ) {
    this.logger.verbose('signIn()');

    const userId = await this.usersService
      .verifyPassword(dto.email, dto.password)
      .catch((err) => {
        if (err instanceof UserNotFoundException) {
          throw new UnauthorizedException();
        }
        throw err;
      });

    const authToken = await this.authTokensService.create(
      userId,
      req.session?.['auth:authorize']?.remember || false,
      req.ip,
      req.headers['user-agent'] || '',
    );

    return {
      access_token: authToken.accessToken || '',
      refresh_token: authToken.refreshToken || '',
    };
  }
}
