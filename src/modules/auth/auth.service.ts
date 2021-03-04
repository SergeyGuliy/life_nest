import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  generatePasswordHash,
  checkPassword,
} from '../../common/password-encoder';

let passwordL = null;

@Injectable()
export default class AuthService {
  async registration(body) {
    body.password = await generatePasswordHash(body.password);
    passwordL = body.password;
    return body;
  }

  async login(body) {
    if (await checkPassword(body.password, passwordL)) {
      return await checkPassword(body.password, passwordL);
    } else {
      throw new HttpException('wrong password', HttpStatus.UNAUTHORIZED);
    }
  }
}
