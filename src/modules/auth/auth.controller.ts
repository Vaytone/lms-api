import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
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

  @ApiOkResponse({
    description: 'Create user with active:false and return it',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'User cant register',
  })
  @Public()
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
}
