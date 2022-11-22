import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import PasswordResetTokenEntity from 'src/entities/password_reset_token.entity';
import UserEntity from 'src/entities/user.entity';
import VerificationCodeEntity from 'src/entities/verification_code.entity';
import { UserIdExistsMiddleware } from 'src/modules/user/middlewares/userIdExists';
import { UserPhoneExistsMiddleware } from 'src/modules/user/middlewares/userPhoneExists';
import MessagesService from '../messages/messages.service';
import UserController from './user.controller';
import UserService from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      VerificationCodeEntity,
      PasswordResetTokenEntity,
    ]),
  ],
  providers: [UserService, JwtService, MessagesService],
  controllers: [UserController],
  exports: [UserService],
})
export default class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdExistsMiddleware)
      .forRoutes(
        'users/get/id/:userId',
        'users/edit/:userId',
        'users/get/contacts/:userId',
        'users/invite-contacts/:userId',
        'users/save-contacts/:userId',
        'users/remove/contact/:userId/:contactId',
      );

    consumer
      .apply(UserPhoneExistsMiddleware)
      .forRoutes(
        'users/get/phone/:phone',
        'users/user-has-email-or-password/:phone',
      );
  }
}
