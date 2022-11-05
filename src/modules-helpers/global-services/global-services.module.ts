import { Module } from '@nestjs/common';

import { ErrorHandlerService } from './error-handler.service';
import { MyLogger } from './my-logger.service';
import { SocketNameSpacerService } from './socket-namespaser.service';

@Module({
  providers: [ErrorHandlerService, MyLogger, SocketNameSpacerService],
  exports: [ErrorHandlerService, MyLogger, SocketNameSpacerService],
})
export class GlobalServicesModule {}
