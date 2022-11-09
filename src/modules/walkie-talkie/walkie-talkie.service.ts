import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import AuthService from '../auth/auth.service';

@Injectable()
export default class WalkieTalkieService {
  constructor(private readonly authService: AuthService) {}

  async validateUserFromToken(token: string) {
    const user = await this.authService.getUserFromToken(token);

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }
}
