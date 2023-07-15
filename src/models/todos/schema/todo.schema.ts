import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { SCHEMAS } from 'common/constants';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true })
  content: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: SCHEMAS.USER,
  })
  author: Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
