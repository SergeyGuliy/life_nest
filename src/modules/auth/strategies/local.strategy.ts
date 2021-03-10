// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';

const timeoutsList = {};

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.userId);
    if (timeoutsList[payload.userId]) {
      clearTimeout(timeoutsList[payload.userId]);
    }
    timeoutsList[payload.userId] = setTimeout(function () {
      console.log('LogOut');
    }, 5000);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
