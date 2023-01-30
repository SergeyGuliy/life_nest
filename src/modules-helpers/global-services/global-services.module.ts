import { Module } from '@nestjs/common';

import { ErrorService } from './error-handler.service.js';
import { MyLogger } from './my-logger.service.js';
import { SocketNameSpacerService } from './socket-namespaser.service.js';

@Module({
  providers: [ErrorService, MyLogger, SocketNameSpacerService],
  exports: [ErrorService, MyLogger, SocketNameSpacerService],
})
export class GlobalServicesModule {}
