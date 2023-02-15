import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema()
export class Result {
  @Prop()
  hash: string;

  @Prop()
  progress: number;

  @Prop()
  risk: number;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
