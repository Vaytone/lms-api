import { Controller, Delete, Get, Put, Query, Req } from '@nestjs/common';
import { ApplicationRoutes } from '../../constants/routes/applications.routes';
import { ApplicationsService } from './applications.service';
import { GetApplicationsQueriesDto } from './dto/get-applications-queries.dto';
import { Request } from 'express';

@Controller(ApplicationRoutes.Base)
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Get()
  get(@Req() req: Request, @Query() queries: GetApplicationsQueriesDto) {
    return this.applicationService.get(req, queries);
  }

  @Put()
  approve() {}

  @Delete()
  delete() {}
}
