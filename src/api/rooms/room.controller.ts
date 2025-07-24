import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomCreateDto } from 'src/api/rooms/dto/room-create.dto';
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
}
