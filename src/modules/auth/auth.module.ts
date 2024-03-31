import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../db/prisma.service';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  providers: [AuthService, PrismaService, UserService, TokenService],
  controllers: [AuthController],
  imports: [NestjsFormDataModule],
  exports: [],
})
export class AuthModule {}
