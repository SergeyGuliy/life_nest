import { Module } from '@nestjs/common';

import { ChatsService } from './chats.service.js';
import { ChatsWsEmitter } from './ws/chats.ws-emitter.js';
import { ChatsController } from './chats.controller.js';
import { EntityManagerModule } from '../../modules-helpers/entities-services/entitiy-manager.module.js';
import { GlobalServicesModule } from '../../modules-helpers/global-services/global-services.module.js';
import { ChatsWsListener } from './ws/chats.ws-listener.js';

@Module({
  imports: [EntityManagerModule, GlobalServicesModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsWsEmitter, ChatsWsListener],
})
export class ChatsModule {}
