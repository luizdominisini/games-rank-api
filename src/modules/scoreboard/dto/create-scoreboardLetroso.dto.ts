import { IsNumber, IsOptional } from 'class-validator';

export class CreateScoreboardLetrosoDto {
  @IsNumber()
  @IsOptional()
  attempts: number;
}
