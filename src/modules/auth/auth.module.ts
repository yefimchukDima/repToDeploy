import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import UserModule from '../user/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { UserJwtStrategy } from './strategies/user_jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_EXP') },
        };
      },
    }),
  ],
  providers: [AuthService, UserJwtStrategy],
  controllers: [AuthController],
})
export default class AuthModule {}
