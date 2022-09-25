import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../assets/database/typeorm-config';

export const setupTypeOrm = () => {
  return TypeOrmModule.forRoot(typeormConfig);
};
