import { Module } from '@nestjs/common';
import AuthModule from '../auth/auth.module';
import WalkieTalkieGateway from './walkie-talkie.gateway';
import WalkieTalkieService from './walkie-talkie.service';

@Module({
  imports: [AuthModule],
  providers: [WalkieTalkieService, WalkieTalkieGateway],
})
export default class WalkieTalkieModule {}
