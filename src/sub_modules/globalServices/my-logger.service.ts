import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MyLogger {
  private readonly logger = new Logger(MyLogger.name);

  log(context: string = MyLogger.name, message: string) {
    this.logger.log(message, context);
  }
  warn(context: string = MyLogger.name, message: string) {
    this.logger.warn(message, context);
  }
  error(context: string = MyLogger.name, message: string) {
    this.logger.error(message, context);
  }
}
