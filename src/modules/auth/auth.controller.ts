import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { AUTH_ROUTES } from '../../constants/routes/auth.routes';
import { AuthService } from './auth.service';
import { InvalidDataException } from '../../exceptions/invalidData.exception';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { ValidateRegisterLinkDto } from './dto/validate-register-link.dto';
import { RegisterByLinkDto } from './dto/register-by-link.dto';
import { Response, Request } from 'express';
import { UserDto } from './dto/user.dto';
import { AuthErrorsEnum } from '../../constants/errors/auth.errors';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from 'src/shared/decorator/public.decorator';
import { FreeAccess } from '../../shared/decorator/freeAccess.decorator';
import { FormDataRequest } from 'nestjs-form-data';
import { Languages } from '../../types/core.types';
import { ValidateOtpDto } from './dto/validate-otp.dto';

@FreeAccess()
@Controller(AUTH_ROUTES.DEFAULT)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description: 'Allow user to register',
    type: ValidateRegisterLinkDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid register link. User cant sign up',
  })
  @Public()
  @Get(AUTH_ROUTES.VALIDATE_REGISTER_LINK)
  validateRegisterLink(
    @Param('code') code: string,
  ): Promise<ValidateRegisterLinkDto | InvalidDataException> | InvalidDataException {
    if (!code) {
      return new InvalidDataException(AuthErrorsEnum.InvalidRegisterLink);
    }

    return this.authService.validateRegisterLink(code);
  }

  @ApiOkResponse({ description: 'Validate register link and email. Create otp for email' })
  @ApiBadRequestResponse({ description: 'Invalid register link or email. Return error' })
  @Public()
  @Get(AUTH_ROUTES.VALIDATE_EMAIL)
  createOtp(
    @Param('code') code: string,
    @Query('email') email: string,
    @Query('lng') lng: Languages,
  ): Promise<{ message: string } | InvalidDataException> | InvalidDataException {
    if (!code) {
      return new InvalidDataException(AuthErrorsEnum.InvalidRegisterLink);
    }

    return this.authService.validateEmail(code, email, lng);
  }

  @ApiOkResponse({ description: 'Validate register link and email. Create otp for email' })
  @ApiBadRequestResponse({ description: 'Invalid register link or email. Return error' })
  @Public()
  @Post(AUTH_ROUTES.VALIDATE_OTP)
  validateOtp(
    @Param('code') code: string,
    @Body() dto: ValidateOtpDto,
  ): Promise<{ message: string } | InvalidDataException> | InvalidDataException {
    if (!code) {
      return new InvalidDataException(AuthErrorsEnum.InvalidRegisterLink);
    }

    return this.authService.validateOtp(code, dto);
  }

  @ApiOkResponse({
    description: 'Create user with active:false and return it',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'User cant register',
  })
  @Public()
  @FormDataRequest()
  @Post(AUTH_ROUTES.REGISTER_BY_LINK)
  register(@Res({ passthrough: true }) res: Response, @Body() dto: RegisterByLinkDto) {
    if (dto.password !== dto.confirmPassword) {
      return new InvalidDataException(AuthErrorsEnum.PasswordDontMatch);
    }
    return this.authService.register(res, dto);
  }

  @ApiOkResponse({
    description: 'User successfully sign in',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'User cant sign in',
  })
  @Public()
  @Post(AUTH_ROUTES.LOGIN)
  login(@Res({ passthrough: true }) res: Response, @Body() dto: SignInDto) {
    return this.authService.login(res, dto);
  }

  @ApiOkResponse({
    description: 'Refresh user session, generate new token',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'User cannot refresh his access, logout',
  })
  @Public()
  @Get(AUTH_ROUTES.REFRESH)
  refresh(@Req() request: Request) {
    return this.authService.refresh(request);
  }

  @ApiOkResponse({
    description: 'Clear user session. Logout',
  })
  @ApiBadRequestResponse({
    description: 'User cannot clear his session',
  })
  @Public()
  @Get(AUTH_ROUTES.LOGOUT)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
