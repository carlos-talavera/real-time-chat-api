import { IsString } from 'class-validator';

export class RoomWhereUniqueDto {
  @IsString()
  id: string;
}
