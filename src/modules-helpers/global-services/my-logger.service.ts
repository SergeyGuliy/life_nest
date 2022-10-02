import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MyLogger {
  private readonly logger = new Logger(MyLogger.name);

  public log(context: string = MyLogger.name, message: string) {
    this.logger.log(message, context);
  }
  public warn(context: string = MyLogger.name, message: string) {
    this.logger.warn(message, context);
  }
  public error(context: string = MyLogger.name, message: string) {
    this.logger.error(message, context);
  }
}
