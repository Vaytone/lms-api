import { ApiProperty } from '@nestjs/swagger';
import { RegisterRole } from '@prisma/client';

export class ValidateRegisterLinkDto {
  @ApiProperty({
    enum: ['admin', 'student', 'guest', 'watcher'],
    description: 'Role for register',
  })
  role: RegisterRole;
  @ApiProperty({
    example: 'School #1',
    description: 'Organisation name',
  })
  organisation_name: string;
}
