import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type GamesSettingsDocument = GamesSettings & Document;

@Schema()
export class GamesSettings {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  timePerTurn: number;

  @Prop()
  timeAdditional: number;

  @Prop()
  gameYearsCount: number;
}

export const GamesSettingsEntity = SchemaFactory.createForClass(GamesSettings);
