import { Module } from '@nestjs/common';

import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { EntityManagerModule } from '../../assets/entitiesManagers/entitiy-manager.module';

@Module({
  imports: [EntityManagerModule],
  controllers: [FriendshipController],
  providers: [FriendshipService],
})
export class FriendshipModule {}
