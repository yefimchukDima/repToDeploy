import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import UserEntity from 'src/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<'admin' | 'common'>(
      'role',
      context.getHandler(),
    );
    const { headers }: Request = context.switchToHttp().getRequest();
    const token = this.jwtService.decode(headers.authorization.split(' ')[1]);
    const isAdmin = (token as UserEntity).isAdmin;

    switch (role) {
      case 'admin':
        return isAdmin;
      case 'common':
        return !isAdmin;
    }
  }
}
