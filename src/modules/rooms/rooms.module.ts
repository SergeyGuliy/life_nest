import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsSocketGateway } from './rooms.gateway';
import { SocketNameSpacerService } from '../../assets/globalServices/socket-namespaser.service';
import { EntityManagerModule } from '../../assets/entitiesManagers/entitiy-manager.module';

@Module({
  imports: [EntityManagerModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsSocketGateway, SocketNameSpacerService],
  exports: [RoomsService],
})
export class RoomsModule {}
