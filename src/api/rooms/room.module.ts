import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from 'src/api/messages/message.module';
import { Room, RoomSchema } from 'src/api/rooms/models/room.model';
import { RoomController } from 'src/api/rooms/room.controller';
import { RoomService } from 'src/api/rooms/room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MessageModule,
  ],
  providers: [RoomService, Room],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
