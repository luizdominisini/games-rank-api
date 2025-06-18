import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import { ScoreboardModule } from './modules/scoreboard/scoreboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScoreboardModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
