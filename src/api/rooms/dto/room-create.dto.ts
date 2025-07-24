import { IsArray, IsString } from 'class-validator';

export class RoomCreateDto {
  @IsArray()
  @IsString({ each: true })
  participants: string[];
}
