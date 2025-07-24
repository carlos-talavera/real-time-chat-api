import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from 'src/api/messages/message.service';
import { Message, MessageSchema } from 'src/api/messages/models/message.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessageService, Message],
  exports: [MessageService],
})
export class MessageModule {}
