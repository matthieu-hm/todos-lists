import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlackAlerterService } from './slack-alerter.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
  ],
  providers: [SlackAlerterService],
  exports: [SlackAlerterService],
})
export class SlackAlerterModule {}
