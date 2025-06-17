import { Module } from '@nestjs/common';
import { GamersModule } from './modules/gamers/gamers.module';

@Module({
  imports: [GamersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
