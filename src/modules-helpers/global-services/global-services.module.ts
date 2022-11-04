import { Module } from '@nestjs/common';

import { ErrorHandlerService } from './error-handler.service';
import { MyLogger } from './my-logger.service';
import { SocketNameSpacerService } from './socket-namespaser.service';
import { MathService } from '@modules-helpers/global-services/math.service';

@Module({
  providers: [
    ErrorHandlerService,
    MyLogger,
    SocketNameSpacerService,
    MathService,
  ],
  exports: [
    ErrorHandlerService,
    MyLogger,
    SocketNameSpacerService,
    MathService,
  ],
})
export class GlobalServicesModule {}
