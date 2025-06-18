import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../database/prisma.module';
import { ScoreboardController } from './scoreboard.controller';
import { ScoreboardService } from './scoreboard.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ScoreboardController],
  providers: [ScoreboardService],
})
export class ScoreboardModule {}
