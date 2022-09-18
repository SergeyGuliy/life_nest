import { Module } from '@nestjs/common';

import { ChatsService } from './chats.service';
import { ChatsWsEmitter } from './ws/chats.ws-emitter';
import { ChatsController } from './chats.controller';
import { EntityManagerModule } from '../../sub_modules/entitiesManagers/entitiy-manager.module';
import { GlobalServicesModule } from '../../sub_modules/globalServices/global-services.module';
import { ChatsWsListener } from './ws/chats.ws-listener';

@Module({
  imports: [EntityManagerModule, GlobalServicesModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsWsEmitter, ChatsWsListener],
})
export class ChatsModule {}
