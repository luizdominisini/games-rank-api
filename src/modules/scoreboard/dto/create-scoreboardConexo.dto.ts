import { IsNumber, IsOptional } from 'class-validator';

export class CreateScoreboardConexoDto {
  @IsNumber()
  @IsOptional()
  tips: number;

  @IsNumber()
  @IsOptional()
  attempts: number;
}
