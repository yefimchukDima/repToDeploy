import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import CompanyAdminModule from '../company_admin/company_admin.module';
import UserModule from '../user/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { CompanyAdminJwtStrategy } from './strategies/company_admin_jwt.strategy';
import { UserJwtStrategy } from './strategies/user_jwt.strategy';

@Module({
  imports: [
    UserModule,
    CompanyAdminModule,
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
  providers: [AuthService, UserJwtStrategy, CompanyAdminJwtStrategy],
  controllers: [AuthController],
})
export default class AuthModule {}
