import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import UserService from 'src/modules/user/user.service';

@Injectable()
export class UserEmailExistsMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  use(
    request: Request<{ emailPhone: string }>,
    response: Response,
    next: NextFunction,
  ): void {
    const {
      params: { emailPhone },
    } = request;

    if (!emailPhone)
      throw new BadRequestException('Email or phone not provided!');

    this.userService
      .getOne({
        where: [{ email: emailPhone }, { mobile_number: emailPhone }],
      })
      .then((res) => {
        if (res) next();
        else
          next({
            statusCode: 404,
            message: 'User not found!',
          });
      })
      .catch((e) => {
        next(e);
      });
  }
}
