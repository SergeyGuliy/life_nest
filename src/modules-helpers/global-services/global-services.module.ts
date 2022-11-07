import { Module } from '@nestjs/common';

import { ErrorService } from './error-handler.service';
import { MyLogger } from './my-logger.service';
import { SocketNameSpacerService } from './socket-namespaser.service';

@Module({
  providers: [ErrorService, MyLogger, SocketNameSpacerService],
  exports: [ErrorService, MyLogger, SocketNameSpacerService],
})
export class GlobalServicesModule {}
