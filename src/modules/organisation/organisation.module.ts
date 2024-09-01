import { Module } from '@nestjs/common';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';

@Module({
  providers: [OrganisationService],
  controllers: [OrganisationController],
  imports: [],
  exports: [],
})
export class OrganisationModule {}
