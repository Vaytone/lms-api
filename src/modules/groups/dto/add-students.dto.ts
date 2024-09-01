import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class AddStudentsDto {
  @ApiProperty({
    example: [1, 2, 3, 4],
    description: 'Student ids',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  readonly ids: number[];
}
