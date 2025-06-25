import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { gameModeEnum } from '../enums/games.enum';

export class CreateScoreboardTermoDto {
  @IsEnum(gameModeEnum)
  gameMode: gameModeEnum;

  @IsNumber()
  @Max(10, { message: 'The max number attempts is 10' })
  @Min(1, { message: 'The min number attempts is 1' })
  attempts: number;
}
