import { Body, Controller, Post, Req } from '@nestjs/common';
import { GroupRoutes } from '../../constants/routes/group.routes';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Request } from 'express';

@Controller(GroupRoutes.Base)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOkResponse({
    description: 'Create new group',
  })
  @ApiBadRequestResponse({
    description: 'Returns error',
  })
  @Post()
  @Roles(Role.owner)
  get(@Req() req: Request, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(req, dto);
  }
}
