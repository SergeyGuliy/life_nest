import { Module } from '@nestjs/common';

import { FriendshipsController } from './friendships.controller';
import { FriendshipsService } from './friendships.service';
import { EntityManagerModule } from '@modules-helpers/entities-services/entitiy-manager.module';
import { GlobalServicesModule } from '@modules-helpers/global-services/global-services.module';

@Module({
  imports: [EntityManagerModule, GlobalServicesModule],
  controllers: [FriendshipsController],
  providers: [FriendshipsService],
})
export class FriendshipsModule {}
