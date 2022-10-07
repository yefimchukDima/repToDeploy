import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import DepartmentService from '../department.service';

@Injectable()
export class DepartmentIdExistsMiddleware implements NestMiddleware {
  constructor(private readonly departmentService: DepartmentService) {}

  use(
    request: Request<{ departmentId: number }>,
    response: Response,
    next: NextFunction,
  ): void {
    const {
      params: { departmentId },
    } = request;

    if (!departmentId) throw new BadRequestException('Department id not provided!');

    this.departmentService
      .getOneBy({
        id: departmentId,
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
