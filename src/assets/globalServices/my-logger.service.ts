import { Logger } from '@nestjs/common';

export class MyLogger {
  private readonly logger = new Logger(MyLogger.name);

  log(context: string = MyLogger.name, message: string) {
    console.log();
    this.logger.log(message, context);
    console.log();
  }
  warn(context: string = MyLogger.name, message: string) {
    console.log();
    this.logger.warn(message, context);
    console.log();
  }
  error(context: string = MyLogger.name, message: string) {
    console.log();
    this.logger.error(message, context);
    console.log();
  }
}
