import { Module } from '@nestjs/common';
import { CourseBuilderService } from './courseBuilder.service';
import { CourseBuilderController } from './courseBuilder.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  providers: [CourseBuilderService],
  controllers: [CourseBuilderController],
  imports: [NestjsFormDataModule],
  exports: [],
})
export class CourseBuilderModule {}
