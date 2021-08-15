import { Module } from '@nestjs/common';

import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { EntityManagerModule } from '../../sub_modules/entitiesManagers/entitiy-manager.module';
import { GlobalServicesModule } from '../../sub_modules/globalServices/global-services.module';

@Module({
  imports: [EntityManagerModule, GlobalServicesModule],
  controllers: [FriendshipController],
  providers: [FriendshipService],
})
export class FriendshipModule {}
