import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { DateTime } from 'luxon';
import { PrismaService } from '../../database/prisma.service';
import { CreateScoreboardConexoDto } from './dto/create-scoreboardConexo.dto';
import { CreateScoreboardLetrosoDto } from './dto/create-scoreboardLetroso.dto';
import { CreateScoreboardTermoDto } from './dto/create-scoreboardTermo.dto';
import { gamesEnum } from './enums/games.enum';

@Injectable()
export class ScoreboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async createScoreboardTermo(
    { words }: CreateScoreboardTermoDto,
    req: Request,
  ) {
    const today = DateTime.now().toISODate();

    try {
      const gameOfDayExist = await this.prismaService.$queryRaw<
        any[]
      >` SELECT * FROM scoreboard WHERE score_data = ${today} AND score_game_id = ${gamesEnum.TERMO} AND score_gamer_id = ${req.user.gamer_id}`;

      if (gameOfDayExist.length > 0) {
        throw new ForbiddenException('You have played this game today.');
      }

      const rules = await this.prismaService.game_rules.findUnique({
        where: { rule_game_id: gamesEnum.TERMO },
      });

      const points = words * rules.point_per_word;

      await this.prismaService.scoreboard.create({
        data: {
          score_words: words,
          score_points: points,
          score_gamer_id: req.user.gamer_id,
          score_game_id: gamesEnum.TERMO,
          score_data: today,
        },
      });

      const rank = await this.prismaService.rank.findFirst({
        where: {
          rank_gamer_id: req.user.gamer_id,
          rank_game_id: gamesEnum.TERMO,
        },
      });

      if (!rank) {
        await this.prismaService.rank.create({
          data: {
            rank_total_points: points,
            rank_game_id: gamesEnum.TERMO,
            rank_gamer_id: req.user.gamer_id,
          },
        });
      } else {
        await this.prismaService.rank.update({
          where: { rank_id: rank.rank_id },
          data: {
            rank_total_points: rank.rank_total_points + points,
          },
        });
      }

      const ranks = await this.prismaService.rank.findMany({
        where: { rank_game_id: gamesEnum.TERMO },
        orderBy: { rank_total_points: 'desc' },
      });

      for (let i = 0; i < ranks.length; i++) {
        await this.prismaService.rank.update({
          where: { rank_id: ranks[i].rank_id },
          data: {
            rank_position: i + 1,
          },
        });
      }

      return { sucess: true };
    } catch (error) {
      throw new BadRequestException(`createScoreboardTermo: ${error.message}`);
    }
  }

  async createScoreboardConexo(
    { attempts, tips }: CreateScoreboardConexoDto,
    req: Request,
  ) {
    let points: number;
    const today = DateTime.now().toISODate();
    try {
      const gameOfDayExist = await this.prismaService.$queryRaw<
        any[]
      >` SELECT * FROM scoreboard WHERE score_data = ${today} AND score_game_id = ${gamesEnum.CONEXO} AND score_gamer_id = ${req.user.gamer_id}`;

      if (gameOfDayExist.length > 0) {
        throw new ForbiddenException('You have played this game today.');
      }

      const rules = await this.prismaService.game_rules.findUnique({
        where: { rule_game_id: gamesEnum.CONEXO },
      });

      points = rules.base_point - tips * rules.penalty_per_tip;

      if (attempts > rules.max_attempts) {
        points -= (attempts - rules.max_attempts) * rules.penalty_per_attempt;
      }

      await this.prismaService.scoreboard.create({
        data: {
          score_attempts: attempts,
          score_tips: tips,
          score_points: points,
          score_gamer_id: req.user.gamer_id,
          score_game_id: gamesEnum.CONEXO,
          score_data: today,
        },
      });

      const rank = await this.prismaService.rank.findFirst({
        where: {
          rank_gamer_id: req.user.gamer_id,
          rank_game_id: gamesEnum.CONEXO,
        },
      });

      if (!rank) {
        await this.prismaService.rank.create({
          data: {
            rank_total_points: points,
            rank_game_id: gamesEnum.CONEXO,
            rank_gamer_id: req.user.gamer_id,
          },
        });
      } else {
        await this.prismaService.rank.update({
          where: { rank_id: rank.rank_id },
          data: {
            rank_total_points: rank.rank_total_points + points,
          },
        });
      }

      const ranks = await this.prismaService.rank.findMany({
        where: { rank_game_id: gamesEnum.CONEXO },
        orderBy: { rank_total_points: 'desc' },
      });

      for (let i = 0; i < ranks.length; i++) {
        await this.prismaService.rank.update({
          where: { rank_id: ranks[i].rank_id },
          data: {
            rank_position: i + 1,
          },
        });
      }

      return { sucess: true };
    } catch (error) {
      throw new BadRequestException(`createScoreboardConexo: ${error.message}`);
    }
  }

  async createScoreboardLetroso(
    { attempts }: CreateScoreboardLetrosoDto,
    req: Request,
  ) {
    const today = DateTime.now().toISODate();
    try {
      const gameOfDayExist = await this.prismaService.$queryRaw<
        any[]
      >` SELECT * FROM scoreboard WHERE score_data = ${today} AND score_game_id = ${gamesEnum.LETROSO} AND score_gamer_id = ${req.user.gamer_id}`;

      if (gameOfDayExist.length > 0) {
        throw new ForbiddenException('You have played this game today.');
      }

      const rules = await this.prismaService.game_rules.findUnique({
        where: { rule_game_id: gamesEnum.LETROSO },
      });

      const points = rules.base_point - attempts * rules.penalty_per_attempt;

      await this.prismaService.scoreboard.create({
        data: {
          score_attempts: attempts,
          score_points: points,
          score_gamer_id: req.user.gamer_id,
          score_game_id: gamesEnum.LETROSO,
          score_data: today,
        },
      });

      const rank = await this.prismaService.rank.findFirst({
        where: {
          rank_gamer_id: req.user.gamer_id,
          rank_game_id: gamesEnum.LETROSO,
        },
      });

      if (!rank) {
        await this.prismaService.rank.create({
          data: {
            rank_total_points: points,
            rank_game_id: gamesEnum.LETROSO,
            rank_gamer_id: req.user.gamer_id,
          },
        });
      } else {
        await this.prismaService.rank.update({
          where: { rank_id: rank.rank_id },
          data: {
            rank_total_points: rank.rank_total_points + points,
          },
        });
      }

      const ranks = await this.prismaService.rank.findMany({
        where: { rank_game_id: gamesEnum.LETROSO },
        orderBy: { rank_total_points: 'desc' },
      });

      for (let i = 0; i < ranks.length; i++) {
        await this.prismaService.rank.update({
          where: { rank_id: ranks[i].rank_id },
          data: {
            rank_position: i + 1,
          },
        });
      }

      return { sucess: true };
    } catch (error) {
      throw new BadRequestException(
        `createScoreboardLetroso: ${error.message}`,
      );
    }
  }

  async rankTermo() {
    try {
      return this.prismaService.rank.findMany({
        where: { rank_game_id: gamesEnum.TERMO },
        include: {
          game: {
            select: {
              game_name: true,
            },
          },
          gamer: {
            select: {
              gamer_name: true,
            },
          },
        },
        orderBy: {
          rank_position: 'asc',
        },
      });
    } catch (error) {
      throw new BadRequestException(`rankTermo: ${error.message}`);
    }
  }

  async rankLetroso() {
    try {
      return this.prismaService.rank.findMany({
        where: { rank_game_id: gamesEnum.LETROSO },
        include: {
          game: {
            select: {
              game_name: true,
            },
          },
          gamer: {
            select: {
              gamer_name: true,
            },
          },
        },
        orderBy: {
          rank_position: 'asc',
        },
      });
    } catch (error) {
      throw new BadRequestException(`rankTermo: ${error.message}`);
    }
  }

  async rankConexo() {
    try {
      return this.prismaService.rank.findMany({
        where: { rank_game_id: gamesEnum.CONEXO },
        include: {
          game: {
            select: {
              game_name: true,
            },
          },
          gamer: {
            select: {
              gamer_name: true,
            },
          },
        },
        orderBy: {
          rank_position: 'asc',
        },
      });
    } catch (error) {
      throw new BadRequestException(`rankTermo: ${error.message}`);
    }
  }
}
