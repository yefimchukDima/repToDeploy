import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import VerificationCodeEntity from 'src/entities/verification_code.entity';
import UserModule from '../user/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { UserJwtStrategy } from './strategies/user_jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationCodeEntity]),
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
  exports: [AuthService],
})
export default class AuthModule {}
