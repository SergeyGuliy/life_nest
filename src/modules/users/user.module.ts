import { Module } from '@nestjs/common';

import { EntityManagerModule } from '@modules-helpers/entities-services/entitiy-manager.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GlobalServicesModule } from '@modules-helpers/global-services/global-services.module';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
