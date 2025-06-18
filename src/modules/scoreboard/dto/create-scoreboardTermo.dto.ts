import { IsNumber, IsOptional, Max } from 'class-validator';

export class CreateScoreboardTermoDto {
  @IsNumber()
  @Max(7, { message: 'The max number words is 7' })
  @IsOptional()
  words: number;
}
