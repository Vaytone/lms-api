import { Module } from '@nestjs/common';
import { OrganisationController } from './organisation.controller';
import { PrismaService } from '../../db/prisma.service';

@Module({
  providers: [PrismaService],
  controllers: [OrganisationController],
  imports: [],
  exports: [],
})
export class OrganisationModule {}
