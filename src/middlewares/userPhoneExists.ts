import {
    BadRequestException,
    Injectable,
    NestMiddleware,
  } from '@nestjs/common';
  import { NextFunction, Request, Response } from 'express';
  import UserService from 'src/modules/user/user.service';
  
  @Injectable()
  export class UserPhoneExistsMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {}
  
    use(
      request: Request<{ phone: string }>,
      response: Response,
      next: NextFunction,
    ): void {
      const {
        params: { phone },
      } = request;
  
      if (!phone) throw new BadRequestException('User phone not provided!');
  
      this.userService
        .getOneBy({
          mobile_number: phone,
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
  