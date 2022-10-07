import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import DepartmentService from '../department.service';

@Injectable()
export class DepartmentPhoneExistsMiddleware implements NestMiddleware {
  constructor(private readonly departmentService: DepartmentService) {}

  use(
    request: Request<{ phone: string }>,
    response: Response,
    next: NextFunction,
  ): void {
    const {
      params: { phone },
    } = request;

    if (!phone)
      throw new BadRequestException('Department phone number not provided!');

    this.departmentService
      .getOneBy({
        phone_number: phone,
      })
      .then((res) => {
        if (res) next();
        else
          next({
            statusCode: 404,
            message: 'Department not found!',
          });
      })
      .catch((e) => {
        next(e);
      });
  }
}
