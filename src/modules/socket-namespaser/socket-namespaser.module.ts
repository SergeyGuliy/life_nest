import { Module } from '@nestjs/common';
import { SocketNamespaserService } from './socket-namespaser.service';

@Module({
  providers: [SocketNamespaserService],
  exports: [SocketNamespaserService],
})
export class SocketNamespaserModule {}
