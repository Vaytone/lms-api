import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { InvalidDataException } from '../../exceptions/invalidData.exception';
import { ValidateRegisterLinkDto } from './dto/validate-register-link.dto';
import { RegisterByLinkDto } from './dto/register-by-link.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { TokenService } from '../token/token.service';
import { Response, Request } from 'express';
import { COOKIE_TOKEN_NAME } from '../../constants/core';
import { UserDto } from './dto/user.dto';
import { SimpleUserDto } from './dto/simple-user.dto';
import { AuthErrorsEnum } from '../../constants/errors/auth.errors';
import { DefaultErrorsEnum } from '../../constants/errors/default.errors';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserWithOrg } from '../user/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  async validateRegisterLink(code: string): Promise<InvalidDataException | ValidateRegisterLinkDto> {
    const link = await this.prisma.registerLink.findFirst({
      where: {
        link_code: code,
      },
      include: {
        organisation: true,
      },
    });

    if (!link) throw new InvalidDataException(AuthErrorsEnum.InvalidRegisterLink);

    if (!link.organisation.active) throw new InvalidDataException(AuthErrorsEnum.InvalidRegisterLink);

    return {
      role: link.role,
      organisation_name: link.organisation.name,
    };
  }

  async register(res: Response, dto: RegisterByLinkDto): Promise<UserDto | InvalidDataException> {
    const link = await this.prisma.registerLink.findFirst({
      where: {
        link_code: dto.code,
      },
      include: {
        organisation: true,
      },
    });

    if (!link) throw new InvalidDataException(AuthErrorsEnum.OrganisationNotFound);

    if (!link.organisation.active) throw new InvalidDataException(AuthErrorsEnum.OrganisationIsInactive);

    const isExist = await this.userService.getUserByLogin(dto.login);

    if (isExist) throw new InvalidDataException(AuthErrorsEnum.UserAlreadyExist);

    try {
      const hashPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.userService.createUser({
        lastName: dto.lastName,
        firstName: dto.firstName,
        login: dto.login,
        organisation_id: link.organisation_id,
        password: hashPassword,
        role: link.role,
      });

      const tokens = this.tokenService.generateTokens(user);
      await this.tokenService.setToken(user.id, tokens.refresh);

      res.cookie(COOKIE_TOKEN_NAME, tokens.refresh, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      const userDto = new SimpleUserDto(user);

      return {
        ...userDto,
        token: tokens.access,
      };
    } catch {
      return new InvalidDataException(DefaultErrorsEnum.SomethingWentWrong);
    }
  }

  async login(res: Response, dto: SignInDto) {
    const user = await this.userService.validateUser(dto);
    const tokens = this.tokenService.generateTokens(user);
    await this.tokenService.updateToken(user.id, tokens.refresh);
    res.cookie(COOKIE_TOKEN_NAME, tokens.refresh, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    const userDto = new SimpleUserDto(user);
    return {
      ...userDto,
      token: tokens.access,
    };
  }

  async refresh(req: Request) {
    const jwtToken = req.cookies[COOKIE_TOKEN_NAME];
    if (!jwtToken) return null;
    const tokenCheck = await this.tokenService.getTokenByToken(jwtToken);
    if (!tokenCheck) throw new UnauthorizedException(AuthErrorsEnum.NotAuthorized);

    try {
      const user: User | null = this.jwtService.verify(jwtToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh',
      });
      const newTokens = this.tokenService.generateTokens(user);
      if (user.id !== tokenCheck.id) {
        return Promise.reject();
      }

      const userBody: UserWithOrg = await this.userService.getUserByLogin(user.login);
      const simpleUserBody = new SimpleUserDto(userBody);

      return { ...simpleUserBody, token: newTokens.access };
    } catch (e) {
      throw new UnauthorizedException(AuthErrorsEnum.NotAuthorized);
    }
  }
}
