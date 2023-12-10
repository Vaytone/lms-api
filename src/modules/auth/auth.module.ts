import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../db/prisma.service';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/JwtAuth.guard';

@Module({
  providers: [
    AuthService,
    PrismaService,
    UserService,
    TokenService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
  imports: [],
  exports: [],
})
export class AuthModule {}
