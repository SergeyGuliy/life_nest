import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { errors } from '@assets/errors';

@Injectable()
export class ErrorHandlerService {
  private readonly errors = errors;

  public error(errorType, locale = 'en', keys = [], context = {}) {
    const error = this.errors[errorType];
    if (error) {
      const { status, locales } = error;
      if (status && locales[locale]) {
        throw new HttpException(locales[locale], status);
      } else {
        throw new HttpException('Unknown error', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Unknown error', HttpStatus.BAD_REQUEST);
    }
  }
}
