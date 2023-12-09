import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AUTH_ROUTES } from '../../constants/routes/auth.routes';
import { AuthService } from './auth.service';
import { InvalidDataException } from '../../exceptions/exception/invalidData.exception';
import { AUTH_ERRORS } from '../../constants/errors';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { ValidateRegisterLinkDto } from './dto/validate-register-link.dto';
import { RegisterByLinkDto } from './dto/register-by-link.dto';
import { Response } from 'express';
import { UserDto } from './dto/user.dto';

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
  @Get(AUTH_ROUTES.VALIDATE_REGISTER_LINK)
  validateRegisterLink(
    @Param('code') code: string,
  ): Promise<ValidateRegisterLinkDto | InvalidDataException> | InvalidDataException {
    if (!code) {
      return new InvalidDataException(AUTH_ERRORS.INVALID_REGISTER_LINK);
    }

    return this.authService.validateRegisterLink(code);
  }

  @ApiOkResponse({
    description: 'Create user with active:false and return it',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'User cant register. ',
  })
  @Get(AUTH_ROUTES.REGISTER_BY_LINK)
  register(@Res({ passthrough: true }) res: Response, @Body() dto: RegisterByLinkDto) {
    if (dto.password !== dto.confirmPassword) {
      return new InvalidDataException(AUTH_ERRORS.PASSWORD_DONT_MATCH);
    }

    return this.authService.register(res, dto);
  }
}
