import { Module } from '@nestjs/common';

import { EntityManagerModule } from '../../modules-helpers/entities-services/entitiy-manager.module.js';
import { GlobalServicesModule } from '../../modules-helpers/global-services/global-services.module.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
