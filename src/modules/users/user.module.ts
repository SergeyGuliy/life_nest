import { Module } from '@nestjs/common';

import { EntityManagerModule } from '../../assets/entitiesManagers/entitiy-manager.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [EntityManagerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
