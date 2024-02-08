import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrmModule } from '@app/orm';
import { OauthGoogleController } from './controllers/oauth-google.controller';
import { OauthGoogleService } from './services/oauth-google.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    ConfigModule,
    OrmModule,
  ],
  controllers: [OauthGoogleController, AuthController],
  providers: [OauthGoogleService],
})
export class AuthModule {}
