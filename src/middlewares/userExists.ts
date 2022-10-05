import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import UserService from 'src/modules/user/user.service';

@Injectable()
export class UserExistsMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  use(
    request: Request<{ userId: number }>,
    response: Response,
    next: NextFunction,
  ): void {
    const {
      params: { userId },
    } = request;

    if (!userId) throw new BadRequestException('User id not provided!');

    this.userService
      .getOneBy({
        id: userId,
      })
      .then((res) => {
        if (res) next();
        else
          next({
            statusCode: 404,
            message: 'User not found!',
          });
      });
  }
}
