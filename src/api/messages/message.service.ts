import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  Message,
  MessageDocument,
} from 'src/api/messages/models/message.model';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  public async createMessage(
    roomId: string,
    senderId: string,
    content: string,
  ): Promise<MessageDocument> {
    const message = new this.messageModel({
      roomId: new Types.ObjectId(roomId),
      senderId: new Types.ObjectId(senderId),
      content,
    });

    return message.save();
  }

  public async deleteRoomMessages(
    roomId: string,
    session: ClientSession,
  ): Promise<void> {
    await this.messageModel.deleteMany({ roomId }).session(session).exec();
  }
}
