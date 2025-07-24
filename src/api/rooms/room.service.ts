import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { MessageService } from 'src/api/messages/message.service';
import { RoomDocument } from 'src/api/rooms/models/room.model';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<RoomDocument>,
    private readonly messageService: MessageService,
  ) {}

  public async findById(id: string): Promise<RoomDocument> {
    const room = await this.roomModel.findById(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  public async findOrCreatePrivateRoom(
    participantIds: string[],
  ): Promise<RoomDocument> {
    const sortedParticipants = participantIds;
    const participantKey = sortedParticipants.join(',');

    // participantKey prevents the same room from being created multiple times
    // in case the room doesn't exist and multiple messages are sent at the same time

    const room = await this.roomModel.findOneAndUpdate(
      { participantKey },
      {
        $setOnInsert: {
          participants: sortedParticipants,
          participantKey,
        },
      },
      { upsert: true, new: true },
    );

    return room;
  }

  public async createGroupRoom(
    participantIds: string[],
  ): Promise<RoomDocument> {
    const room = await this.roomModel.create({
      participants: participantIds,
    });

    return room;
  }

  public async validateUserCanJoinPrivateRoom(
    roomId: string,
    userId: string,
  ): Promise<void> {
    if (!isValidObjectId(roomId)) {
      throw new UnauthorizedException('Invalid room ID');
    }
    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new UnauthorizedException('Room not found');
    }

    const participantIds = room.participants;
    if (!participantIds.includes(new Types.ObjectId(userId))) {
      throw new UnauthorizedException('You are not a participant in this room');
    }
  }
}
