import { Module } from '@nestjs/common';

import {
  setupConfigModule,
  setupDefaultModules,
  setupMongoose,
  setupTypeOrm,
} from './setup/index.js';

@Module({
  imports: [
    setupMongoose(),
    setupConfigModule(),
    setupTypeOrm(),
    ...setupDefaultModules(),
  ],
})
export class AppModule {}
