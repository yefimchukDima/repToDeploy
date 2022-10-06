import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/entities/user.entity';
import VerificationCodeEntity from 'src/entities/verification_code.entity';
import { UserIdExistsMiddleware } from 'src/middlewares/userIdExists';
import { UserPhoneExistsMiddleware } from 'src/middlewares/userPhoneExists';
import UserController from './user.controller';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, VerificationCodeEntity])],
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export default class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdExistsMiddleware)
      .forRoutes('users/get/id/:userId', 'users/edit/:userId');

    consumer
      .apply(UserPhoneExistsMiddleware)
      .forRoutes(
        'users/get/phone/:phone',
        'users/generate-verification-code/:phone',
      );
  }
}
