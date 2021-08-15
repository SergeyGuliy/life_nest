import { Module } from '@nestjs/common';

import { EntityManagerModule } from '../../sub_modules/entitiesManagers/entitiy-manager.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GlobalServicesModule } from '../../sub_modules/globalServices/global-services.module';

@Module({
  imports: [GlobalServicesModule, EntityManagerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
