import { MongooseModule } from '@nestjs/mongoose';

export const setupMongoose = () => {
  return MongooseModule.forRoot('mongodb://root:example@mongo:27017/');
};


