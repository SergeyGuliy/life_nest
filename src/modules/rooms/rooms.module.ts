import { Module } from '@nestjs/common';

import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsSocketGateway } from './rooms.gateway';
import { SocketNameSpacerService } from '../../sub_modules/globalServices/socket-namespaser.service';
import { EntityManagerModule } from '../../sub_modules/entitiesManagers/entitiy-manager.module';
import { GlobalServicesModule } from '../../sub_modules/globalServices/global-services.module';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsSocketGateway, SocketNameSpacerService],
  exports: [RoomsService],
})
export class RoomsModule {}
