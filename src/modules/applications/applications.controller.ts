import { Controller, Delete, Get, NotFoundException, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApplicationRoutes } from '../../constants/routes/applications.routes';
import { ApplicationsService } from './applications.service';
import { GetApplicationsQueriesDto } from './dto/get-applications-queries.dto';
import { Request } from 'express';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorator/role.decorator';
import { InvalidDataException } from '../../exceptions/invalidData.exception';
import { DefaultErrorsEnum } from '../../constants/errors/default.errors';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

@UseGuards(RolesGuard)
@Controller(ApplicationRoutes.Base)
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @ApiOkResponse({
    description: 'Returns applications in organisation',
  })
  @ApiBadRequestResponse({
    description: 'Returns error',
  })
  @Get()
  @Roles(Role.admin, Role.owner)
  get(@Req() req: Request, @Query() queries: GetApplicationsQueriesDto) {
    return this.applicationService.get(req, queries);
  }

  @ApiOkResponse({
    description: 'Accept application and return user_statuses object',
  })
  @ApiBadRequestResponse({
    description: 'Returns error',
  })
  @Put(ApplicationRoutes.Accept)
  @Roles(Role.owner)
  accept(@Req() req: Request, @Query('id') id: number) {
    if (!id) {
      throw new InvalidDataException(DefaultErrorsEnum.SomethingWentWrong);
    }

    return this.applicationService.accept(req, id);
  }

  @ApiOkResponse({
    description: 'Reject application and return user_statuses object',
  })
  @ApiBadRequestResponse({
    description: 'Returns error',
  })
  @Put(ApplicationRoutes.Reject)
  @Roles(Role.owner)
  reject(@Req() req: Request, @Query('id') id: number) {
    if (!id) {
      throw new InvalidDataException(DefaultErrorsEnum.SomethingWentWrong);
    }

    return this.applicationService.reject(req, id);
  }

  @Delete()
  delete() {}
}
