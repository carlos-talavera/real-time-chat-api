import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomCreateDto } from 'src/api/rooms/dto/room-create.dto';
import { RoomWhereUniqueDto } from 'src/api/rooms/dto/room-where-unique.dto';
import { RoomService } from 'src/api/rooms/room.service';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  public async createRoom(@Body() roomCreateDto: RoomCreateDto) {
    return this.roomService.createGroupRoom(roomCreateDto.participants);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  public async deleteRoom(@Body() room: RoomWhereUniqueDto) {
    return this.roomService.deleteRoom(room.id);
  }
}
