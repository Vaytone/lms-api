import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../db/prisma.service';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';

@Module({
  providers: [AuthService, PrismaService, UserService, TokenService],
  controllers: [AuthController],
  imports: [],
  exports: [],
})
export class AuthModule {}
