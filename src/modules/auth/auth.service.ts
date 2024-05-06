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
import { UserDetails } from '../user/types/user.types';
import { FileManagerService } from '../fileManager/fileManager.service';
import { AWSDirname, Languages } from '../../types/core.types';
import { generate } from 'otp-generator';
import { Resend } from 'resend';
import { generateEmailText } from './helpers/auth.helper';
import { ValidateOtpDto } from './dto/validate-otp.dto';

@Injectable()
export class AuthService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  constructor(
    private readonly prisma: PrismaService,
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private fileService: FileManagerService,
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

    return {
      role: link.role,
      organisation_name: link.organisation.name,
    };
  }

  async validateEmail(
    code: string,
    email: string,
    lng: Languages,
  ): Promise<InvalidDataException | { message: string }> {
    const link = await this.prisma.registerLink.findFirst({
      where: {
        link_code: code,
      },
      include: {
        organisation: true,
      },
    });

    if (!link) throw new InvalidDataException(AuthErrorsEnum.InvalidRegisterLink);
    if (!link.organisation.active) throw new InvalidDataException(AuthErrorsEnum.OrganisationIsInactive);

    const isExist = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (isExist) throw new InvalidDataException(AuthErrorsEnum.UserAlreadyExist);

    const otp = generate(6, { lowerCaseAlphabets: false, specialChars: false });
    const text = generateEmailText(lng, otp);

    await this.prisma.emailOTP.deleteMany({
      where: {
        email: email,
      },
    });

    await this.prisma.emailOTP.create({
      data: {
        email,
        otp,
      },
    });

    const { error } = await this.resend.emails.send({
      from: 'VAYTONE LMS <onboarding@vaytone.xyz>',
      to: [email],
      subject: 'Welcome to Vaytone LMS',
      html: text,
    });

    if (error) {
      console.log(error);
      throw new InvalidDataException(AuthErrorsEnum.EmailServiceError);
    }

    return {
      message: 'Success',
    };
  }

  async validateOtp(code: string, dto: ValidateOtpDto) {
    const link = await this.prisma.registerLink.findFirst({
      where: {
        link_code: code,
      },
      include: {
        organisation: true,
      },
    });

    if (!link) throw new InvalidDataException(AuthErrorsEnum.OrganisationNotFound);
    if (!link.organisation.active) throw new InvalidDataException(AuthErrorsEnum.OrganisationIsInactive);

    const checkOtp = await this.prisma.emailOTP.findFirst({
      where: {
        otp: dto.otp,
        email: dto.email,
      },
    });

    if (!checkOtp) throw new InvalidDataException(AuthErrorsEnum.OTPInvalid);

    const otpCreatedAt = new Date(checkOtp.created_at);

    const currentTime = new Date();

    const diffInMinutes = (currentTime.getTime() - otpCreatedAt.getTime()) / (1000 * 60);

    if (diffInMinutes > 10) {
      throw new InvalidDataException(AuthErrorsEnum.OTPExpired);
    }

    return {
      message: 'Success',
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

    const isExist = await this.userService.getUserByEmail(dto.email);
    if (isExist) throw new InvalidDataException(AuthErrorsEnum.UserAlreadyExist);

    try {
      let avatarName = null;

      if (dto.avatar) {
        avatarName = await this.fileService.uploadFile(AWSDirname.Avatars, dto.avatar);
        console.log(avatarName);
      }

      const hashPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.userService.createUser({
        lastName: dto.lastName,
        firstName: dto.firstName,
        email: dto.email,
        organisation_id: link.organisation_id,
        password: hashPassword,
        greetingMessage: dto.greetingMessage,
        role: link.role,
        avatar: avatarName,
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
    } catch (e) {
      console.log(e);
      throw new InvalidDataException(DefaultErrorsEnum.SomethingWentWrong);
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

      const userBody: UserDetails = await this.userService.getUserByEmail(user.email);
      const simpleUserBody = new SimpleUserDto(userBody);

      return { ...simpleUserBody, token: newTokens.access };
    } catch (e) {
      throw new UnauthorizedException(AuthErrorsEnum.NotAuthorized);
    }
  }

  async logout(res: Response) {
    res.clearCookie(COOKIE_TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });

    return true;
  }
}
