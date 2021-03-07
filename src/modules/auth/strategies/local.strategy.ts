// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import AuthService from '../auth.service';

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
    return {
      id: payload.id,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
      country: payload.country,
    };
  }

  async register(body): Promise<any> {
    return await this.authService.createUser(body);
  }

  async login(body): Promise<any> {
    const user = await this.authService.validateUser(body);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
