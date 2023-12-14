import { Controller, Get, UseGuards } from '@nestjs/common';
import { ORGANISATION_ROUTES } from '../../constants/routes/organisation.routes';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../../shared/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller(ORGANISATION_ROUTES.DEFAULT)
export class OrganisationController {
  @Roles(Role.admin)
  @Get()
  get() {
    return 'hello';
  }
}
