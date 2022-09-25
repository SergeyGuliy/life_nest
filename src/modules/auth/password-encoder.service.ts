import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SALT_ROUND_CRYPT } from '@constants/index.js';
import { ErrorHandlerService } from '@modules-helpers/global-services/error-handler.service';

@Injectable()
export class PasswordEncoderService {
  constructor(private readonly errorHandlerService: ErrorHandlerService) {}
  private SALT_ROUND_CRYPT = SALT_ROUND_CRYPT;

  private checkPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  public generatePasswordHash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(this.SALT_ROUND_CRYPT, function (err1, salt) {
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

  public async validatePassword({ bodyPassword, userPassword }, callback) {
    const isPasswordSame = bodyPassword === userPassword;
    const isPasswordHashedSame = await this.checkPassword(
      bodyPassword,
      userPassword,
    );
    if (!(isPasswordSame || isPasswordHashedSame)) {
      callback();
    }
  }
}

