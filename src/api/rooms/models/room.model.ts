import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true, versionKey: false })
export class Room {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  @Prop({ unique: true, sparse: true })
  participantKey: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
