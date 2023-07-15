import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { SCHEMAS } from 'common/constants';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop([{ type: SchemaTypes.ObjectId, ref: SCHEMAS.USER }])
  subscriptions: Types.ObjectId[];

  @Prop([{ type: SchemaTypes.ObjectId, ref: SCHEMAS.USER }])
  subscribers: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
