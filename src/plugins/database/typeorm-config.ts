import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log(process.env.POSTGRES_HOST);
export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/entities/**/*.js'],
  // logging: true,
  migrations: ['src/common/database/migration/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize: true,
};
