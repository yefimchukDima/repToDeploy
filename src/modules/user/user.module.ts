import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/entities/user.entity';
import UserController from './user.controller';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export default class UserModule {}
