import { Injectable } from '@nestjs/common';
import { CreateCourseDTO } from './dto/create-course.dto';
import { BuilderBlockTypeEnum } from './types/coureBuilder.types';
import { AWSDirname } from '../../types/core.types';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { FileManagerService } from '../fileManager/fileManager.service';

import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class CourseBuilderService {
  constructor(
    private readonly fileService: FileManagerService,
    private readonly prisma: PrismaService,
  ) {}

  async createCourse(dto: CreateCourseDTO, req: Request) {
    const uploadedFiles = [];

    try {
      const updatedItems = await Promise.all(
        dto.items.map(async (item) => {
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

      await this.prisma.courses.create({
        data: {
          items: JSON.stringify(updatedItems),
          author_id: req.user.id,
          blocks: JSON.stringify(dto.blocks),
          description: dto.main.description,
          title: dto.main.title,
          blocksInfo: JSON.stringify(dto.blocksInfo),
        },
      });
    } catch (e) {
      await Promise.all(uploadedFiles.map((fileUrl) => this.fileService.s3_delete(fileUrl, AWSDirname.Files)));

      throw new Error('File upload failed. All uploaded files have been deleted.');
    }

    return 1;
  }
}
