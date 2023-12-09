import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { InvalidDataException } from '../../exceptions/exception/invalidData.exception';
import { AUTH_ERRORS, DEFAULT_ERRORS } from '../../constants/errors';
import { ValidateRegisterLinkDto } from './dto/validate-register-link.dto';
import { RegisterByLinkDto } from './dto/register-by-link.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { TokenService } from '../token/token.service';
import { Response } from 'express';
import { TOKEN_COOKIE } from '../../constants/core';
import { UserDto } from './dto/user.dto';
import { SimpleUserDto } from './dto/simple-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private userService: UserService,
    private tokenService: TokenService,
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

    if (!link) throw new InvalidDataException(AUTH_ERRORS.INVALID_REGISTER_LINK);

    if (!link.organisation.active) throw new InvalidDataException(AUTH_ERRORS.INVALID_REGISTER_LINK);

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

    if (!link) throw new InvalidDataException(AUTH_ERRORS.ORGANISATION_NOT_FOUND);

    if (!link.organisation.active) throw new InvalidDataException(AUTH_ERRORS.ORGANISATION_IS_INACTIVE);

    const isExist = await this.userService.getUserByLogin(dto.login);

    if (isExist) throw new InvalidDataException(AUTH_ERRORS.USER_ALREADY_EXIST);

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

      res.cookie(TOKEN_COOKIE, tokens.refresh, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      const userDto = new SimpleUserDto(user);

      return {
        ...userDto,
        token: tokens.access,
      };
    } catch {
      return new InvalidDataException(DEFAULT_ERRORS.SOMETHING_WENT_WRONG);
    }
  }
}
