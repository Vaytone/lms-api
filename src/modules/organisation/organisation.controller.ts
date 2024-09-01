import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { ORGANISATION_ROUTES } from '../../constants/routes/organisation.routes';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { OrganisationService } from './organisation.service';
import { Request } from 'express';

@UseGuards(RolesGuard)
@Controller(ORGANISATION_ROUTES.DEFAULT)
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Roles(Role.admin, Role.student, Role.owner, Role.watcher)
  @Get()
  get() {
    return 'hello';
  }

  @Roles(Role.admin, Role.student, Role.owner, Role.watcher)
  @Get(ORGANISATION_ROUTES.GET_ADMINS)
  getOrganisationAdmins(@Req() req: Request) {
    return this.organisationService.getAdmins(req);
  }

  @Roles(Role.admin, Role.student, Role.owner, Role.watcher)
  @Get(ORGANISATION_ROUTES.GET_STUDENTS_NOT_IN_GROUP)
  getStudentsNotInGroup(@Req() req: Request, @Query('id') id: number) {
    return this.organisationService.getStudentsNotInGroup(req, id);
  }

  getOrganisationStudent() {}

  getOrganisationWatcher() {}
}
