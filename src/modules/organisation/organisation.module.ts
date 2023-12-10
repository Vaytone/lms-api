import { Module } from '@nestjs/common';
import { OrganisationController } from './organisation.controller';

@Module({
  providers: [],
  controllers: [OrganisationController],
  imports: [],
  exports: [],
})
export class OrganisationModule {}
