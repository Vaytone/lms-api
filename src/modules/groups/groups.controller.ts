import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { GroupRoutes } from '../../constants/routes/group.routes';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Request } from 'express';
import { GetGroupsQueriesDto } from './dto/get-groups-queries.dto';
import { AddStudentsDto } from './dto/add-students.dto';

@Controller(GroupRoutes.Base)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOkResponse({
    description: 'Create new group',
  })
  @ApiBadRequestResponse({
    description: 'Returns error',
  })
  @Post(GroupRoutes.Create)
  @Roles(Role.owner)
  create(@Req() req: Request, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(req, dto);
  }

  @ApiOkResponse({
    description: 'Return group',
  })
  @ApiBadRequestResponse({
    description: 'Returns error',
  })
  @Get(':id')
  @Roles(Role.owner, Role.admin)
  getGroup(@Req() req: Request, @Param('id') id: number) {
    return this.groupsService.getGroupById(req, id);
  }

  @ApiOkResponse({
    description: 'Return groups list in organisation',
  })
  @ApiBadRequestResponse({
    description: 'Returns error',
  })
  @Get()
  @Roles(Role.owner, Role.admin)
  get(@Req() req: Request, @Query() queries: GetGroupsQueriesDto) {
    return this.groupsService.get(req, queries);
  }

  @ApiOkResponse({
    description: 'Add students to group',
  })
  @ApiBadRequestResponse({
    description: 'Returns error',
  })
  @Post(GroupRoutes.AddStudents)
  @Roles(Role.owner, Role.admin)
  addStudents(@Req() req: Request, @Query('id') id: number, @Body() data: AddStudentsDto) {
    return this.groupsService.addStudents(req, data, id);
  }
}
