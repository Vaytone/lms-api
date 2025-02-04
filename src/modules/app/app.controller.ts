import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '../../shared/decorator/public.decorator';
import { FreeAccess } from '../../shared/decorator/freeAccess.decorator';

@FreeAccess()
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return this.appService.getHello();
  }
}
