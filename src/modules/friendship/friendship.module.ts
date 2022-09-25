import { Module } from '@nestjs/common';

import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { EntityManagerModule } from '../../modules-helpers/entities-services/entitiy-manager.module';
import { GlobalServicesModule } from '../../modules-helpers/global-services/global-services.module';

@Module({
  imports: [EntityManagerModule, GlobalServicesModule],
  controllers: [FriendshipController],
  providers: [FriendshipService],
})
export class FriendshipModule {}
