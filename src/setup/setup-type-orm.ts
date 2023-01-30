import { TypeOrmModule } from '@nestjs/typeorm';

import { typeormConfig } from '../modules-helpers/entities-services/typeorm-config.js';

export const setupTypeOrm = () => {
  return TypeOrmModule.forRoot(typeormConfig);
};
