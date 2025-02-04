import { Body, Controller, Post, Res } from '@nestjs/common';
import { CourseBuilderService } from './courseBuilder.service';
import { FormDataRequest } from 'nestjs-form-data';
import { CourseBuilderRoutes } from '../../constants/routes/courseBuilder.routes';
import { Response } from 'express';
import { CreateCourseDTO } from './dto/create-course.dto';
import { validateCourseForm } from './helper/course.validation';
import { BuilderBlockTypeEnum } from './types/coureBuilder.types';
import { FileManagerService } from '../fileManager/fileManager.service';
import { AWSDirname } from '../../types/core.types';
import { v4 as uuidv4 } from 'uuid';

@Controller(CourseBuilderRoutes.Base)
export class CourseBuilderController {
  constructor(
    private readonly courseBuilderService: CourseBuilderService,
    private fileService: FileManagerService,
  ) {}

  @Post(CourseBuilderRoutes.Create)
  @FormDataRequest()
  async create(@Res({ passthrough: true }) res: Response, @Body() dto: CreateCourseDTO): Promise<any> {
    console.log(dto);

    console.log(dto.items);

    const uploadedFiles = [];
    const processedItems = dto.items;

    try {
      const updatedItems = await Promise.all(
        processedItems.map(async (item) => {
          if (item.data.type === BuilderBlockTypeEnum.File || item.data.type === BuilderBlockTypeEnum.Image) {
            const fileName = dto[item.data.fileId].originalName;
            const fileUrl = await this.fileService.uploadMinorFile(AWSDirname.Files, {
              ...dto[item.data.fileId],
              originalName: `${uuidv4()}[]${Buffer.from(fileName, 'latin1').toString('utf8')}`,
            });

            uploadedFiles.push(fileUrl);

            return { ...item, data: { ...item.data, fileId: fileUrl } };
          }
          return item;
        }),
      );

      console.log(updatedItems);
    } catch (error) {
      console.log(error);
      await Promise.all(uploadedFiles.map((fileUrl) => this.fileService.s3_delete(fileUrl, AWSDirname.Files)));

      throw new Error('File upload failed. All uploaded files have been deleted.');
    }

    // Допустим, dto будет содержать itemId и файл
    // const { items, files } = dto;
    //
    // // Пример обработки файлов и их сопоставления с items
    // const fileMap = new Map();
    // files.forEach((file, index) => {
    //   const item = items[index];
    //   fileMap.set(item.fileId, file);
    // });

    // Дальше можно продолжить обработку, например, загрузку файлов в S3

    return 1; // Возвращаем результат
  }
}
