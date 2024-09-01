import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    example: '11-B',
    description: 'Group name',
  })
  @Length(1)
  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @ApiProperty({
    example: 1,
    description: 'Mentor ID',
  })
  @Min(1)
  @IsNumber()
  readonly mentor: number;
}
