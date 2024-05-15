import { Controller, Delete, Get, Put } from '@nestjs/common';
import { ApplicationRoutes } from '../../constants/routes/applications.routes';
import { ApplicationsService } from './applications.service';

@Controller(ApplicationRoutes.Base)
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Get()
  get() {
    return this.applicationService.get();
  }

  @Put()
  approve() {}

  @Delete()
  delete() {}
}
