import { Body, Controller, Post, Req } from '@nestjs/common';
import { CourseBuilderService } from './courseBuilder.service';
import { FormDataRequest } from 'nestjs-form-data';
import { CourseBuilderRoutes } from '../../constants/routes/courseBuilder.routes';
import { Request } from 'express';
import { CreateCourseDTO } from './dto/create-course.dto';

@Controller(CourseBuilderRoutes.Base)
export class CourseBuilderController {
  constructor(
    private readonly courseBuilderService: CourseBuilderService,
  ) {}

  @Post(CourseBuilderRoutes.Create)
  @FormDataRequest()
  async create(@Req() req: Request, @Body() dto: CreateCourseDTO): Promise<any> {
    return this.courseBuilderService.createCourse(dto, req);
  }
}
