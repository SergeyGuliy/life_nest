import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class PasswordEncoderService {
  private saltRounds = 2;

  generatePasswordHash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(this.saltRounds, function (err1, salt) {
        bcrypt.hash(password, salt, function (err2, hash) {
          if (err1) {
            reject(err1);
          } else if (err2) {
            reject(err2);
          } else {
            resolve(hash);
          }
        });
      });
    });
  }
  checkPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async validatePassword(bodyPassword, userPassword) {
    const isPasswordSame = bodyPassword === userPassword;
    const isPasswordHashedSame = await this.checkPassword(
      bodyPassword,
      userPassword,
    );
    if (!(isPasswordSame || isPasswordHashedSame)) {
      throw new HttpException('Wrong password or login', HttpStatus.NOT_FOUND);
    }
  }
}
