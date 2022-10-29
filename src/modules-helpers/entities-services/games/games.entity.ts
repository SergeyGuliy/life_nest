import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
// import {
//   GamesSettings,
//   GamesSettingsEntity,
// } from '@modules-helpers/entities-services/games/games-settings.entity';
import { Transform } from 'class-transformer';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  roomId: string;

  @Prop({ type: Object })
  gameSettings: any;

  @Prop({ type: Object })
  gameData: any;
}

export const GamesEntity = SchemaFactory.createForClass(Game);
