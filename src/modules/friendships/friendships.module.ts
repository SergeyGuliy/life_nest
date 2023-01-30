import { Module } from '@nestjs/common';

import { FriendshipsController } from './friendships.controller.js';
import { FriendshipsService } from './friendships.service.js';
import { EntityManagerModule } from '../../modules-helpers/entities-services/entitiy-manager.module.js';
import { GlobalServicesModule } from '../../modules-helpers/global-services/global-services.module.js';

@Module({
  imports: [EntityManagerModule, GlobalServicesModule],
  controllers: [FriendshipsController],
  providers: [FriendshipsService],
})
export class FriendshipsModule {}
