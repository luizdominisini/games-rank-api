import { Body, Controller, Post } from '@nestjs/common';
import { GamersService } from './gamers.service';

@Controller('v1/gamers')
export class GamersController {
  constructor(private gamers_service: GamersService) {}
  @Post('create')
  async createGamer(@Body() data: any) {
    return this.gamers_service.createGamer(data);
  }
}
