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
  roomId: number;

  @Prop()
  gameAdmin: number;

  @Prop({ type: Array })
  gameUsers: any;

  @Prop({ type: Object })
  gameSettings: any;

  @Prop({ type: Object })
  gameData: any;

  @Prop({ type: Array })
  gameHistory: any;

  @Prop({ type: Array })
  shares: any;

  @Prop({ type: Array })
  cryptos: any;

  @Prop({ type: Object })
  credits: any;

  @Prop({ type: Object })
  deposits: any;

  @Prop({ type: Object })
  modifiers: any;

  @Prop({ type: Array })
  userDataCache: any;

  @Prop({ type: Array })
  tickUserNews: any;

  @Prop({ type: Array })
  tickGameNews: any;
}

export const GamesEntity = SchemaFactory.createForClass(Game);
