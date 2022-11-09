import { Module } from '@nestjs/common';
import AuthModule from '../auth/auth.module';
import WalkieTalkieController from './walkie-talkie.controller';
import WalkieTalkieGateway from './walkie-talkie.gateway';
import WalkieTalkieService from './walkie-talkie.service';

@Module({
  imports: [AuthModule],
  providers: [WalkieTalkieService, WalkieTalkieGateway],
  controllers: [WalkieTalkieController],
})
export default class WalkieTalkieModule {}
