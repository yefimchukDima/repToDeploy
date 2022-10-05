import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/entities/user.entity';
import { UserExistsMiddleware } from 'src/middlewares/userExists';
import UserController from './user.controller';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export default class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserExistsMiddleware)
      .forRoutes('users/edit/:userId');
  }
}
