import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EntityManagerModule } from '../../assets/entitiesManagers/entitiy-manager.module';

@Module({
  imports: [EntityManagerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
