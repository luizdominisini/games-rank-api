import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CreateScoreboardConexoDto } from './dto/create-scoreboardConexo.dto';
import { CreateScoreboardLetrosoDto } from './dto/create-scoreboardLetroso.dto';
import { CreateScoreboardTermoDto } from './dto/create-scoreboardTermo.dto';
import { ScoreboardService } from './scoreboard.service';

@Controller('scoreboard')
@UseGuards(AuthGuard)
export class ScoreboardController {
  constructor(private readonly scoreboardService: ScoreboardService) {}

  @Post('create/termo')
  createScoreboardTermo(
    @Body() data: CreateScoreboardTermoDto,
    @Req() req: Request,
  ) {
    return this.scoreboardService.createScoreboardTermo(data, req);
  }

  @Post('create/conexo')
  createScoreboardConexo(
    @Body() data: CreateScoreboardConexoDto,
    @Req() req: Request,
  ) {
    return this.scoreboardService.createScoreboardConexo(data, req);
  }

  @Post('create/letroso')
  createScoreboardLetroso(
    @Body() data: CreateScoreboardLetrosoDto,
    @Req() req: Request,
  ) {
    return this.scoreboardService.createScoreboardLetroso(data, req);
  }

  @Get('rank/termo')
  rankTermo() {
    return this.scoreboardService.rankTermo();
  }

  @Get('rank/letroso')
  rankLetroso() {
    return this.scoreboardService.rankLetroso();
  }

  @Get('rank/conexo')
  rankConexo() {
    return this.scoreboardService.rankConexo();
  }

  @Get('rank/geral')
  rankGeral() {
    return this.scoreboardService.rankGeral();
  }
}
