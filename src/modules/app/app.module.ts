import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { CoreModule } from '../core/core.module';
import { OrganisationModule } from '../organisation/organisation.module';

@Module({
  imports: [ConfigModule.forRoot(), CoreModule, AuthModule, OrganisationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
