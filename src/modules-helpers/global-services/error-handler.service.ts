import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { errors } from '@assets/errors';

@Injectable()
export class ErrorService {
  private readonly errors = errors;

  private parseErrorString(errorTemplate, keys) {
    let errorString = errorTemplate;
    if (keys.length) {
      keys.forEach((item, id) => {
        errorString = errorTemplate.replace(`{${id}`, `'${item}'`);
      });
    }
    return errorString;
  }

  public e(errorType, locale = 'en', keys = [], context = {}) {
    const error = this.errors[errorType];

    if (error) {
      const { status, locales } = error;
      if (status && locales[locale]) {
        const errorString = this.parseErrorString(locales[locale], keys);
        throw new HttpException(errorString, status);
      } else {
        throw new HttpException('Unknown error', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Unknown error', HttpStatus.BAD_REQUEST);
    }
  }
}
