import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  refreshToken: string;

  @Prop({ default: null })
  refreshTokenExpiresAt: number;

  toObject?: () => User;
}

export const UserSchema = SchemaFactory.createForClass(User);
