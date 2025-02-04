import { Type, Transform } from 'class-transformer';
import { IsString, IsObject, IsArray, ValidateNested, IsOptional, IsDefined } from 'class-validator';
import { CourseItem } from '../types/coureBuilder.types';

export class MainDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateCourseDTO {
  @ValidateNested()
  @Type(() => MainDTO)
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @IsDefined()
  main: MainDTO;

  @Transform(({ value }) => {
    const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(parsedValue)) {
      throw new Error('Items must be an array');
    }
    return parsedValue;
  })
  items: CourseItem[];

  @IsObject()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  blocks: Record<string, string[]>;

  @IsObject()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  blocksInfo: Record<string, { title: string }>;

  [key: string]: any | File;
}
