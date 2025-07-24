import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RoomCreateDto } from 'src/api/rooms/dto/room-create.dto';
import { RoomWhereUniqueDto } from 'src/api/rooms/dto/room-where-unique.dto';
import { RoomService } from 'src/api/rooms/room.service';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { AuthUser } from 'src/shared/auth/models/auth-user.model';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  public async getUserRooms(@Req() req: Request) {
    return this.roomService.findUserRooms((req.user as AuthUser).id);
  }

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
