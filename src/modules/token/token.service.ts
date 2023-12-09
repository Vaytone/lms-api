import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../db/prisma.service';
import { Token, User } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  getTokenByUserId(user_id: number): Promise<Token> {
    return this.prisma.token.findFirst({
      where: {
        user_id,
      },
    });
  }

  getTokenByToken(token: string): Promise<Token> {
    return this.prisma.token.findFirst({
      where: {
        token,
      },
    });
  }

  generateTokens(user: User) {
    const payload = {
      id: user.id,
      login: user.login,
    };
    return {
      access: this.jwtService.sign(payload, {
        expiresIn: '30m',
        privateKey: process.env.JWT_ACCESS_SECRET || 'access',
      }),
      refresh: this.jwtService.sign(payload, {
        expiresIn: '30d',
        privateKey: process.env.JWT_REFRESH_SECRET || 'refresh',
      }),
    };
  }

  async setToken(user_id: number, token: string) {
    return this.prisma.token.create({
      data: {
        token,
        user_id,
      },
    });
  }

  async updateToken(user_id: number, token: string) {
    const tokenToUpdate = await this.getTokenByUserId(user_id);

    if (tokenToUpdate) {
      return this.prisma.token.update({
        where: {
          user_id,
        },
        data: {
          token,
        },
      });
    } else {
      return this.setToken(user_id, token);
    }
  }
}
