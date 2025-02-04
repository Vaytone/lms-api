import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { CoreModule } from '../core/core.module';
import { OrganisationModule } from '../organisation/organisation.module';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';
import { OrganisationActiveStatusGuard } from '../organisation/guard/organisationActiveStatus.guard';
import { PrismaService } from '../../db/prisma.service';
import { join } from 'path';
import { ApplicationsModule } from '../applications/applications.module';
import { GroupsModule } from '../groups/groups.module';
import { CourseBuilderModule } from '../courseBuilder/courseBuilder.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', '/public/img'),
      exclude: ['/api/(.*)'],
      serveRoot: '/img',
      serveStaticOptions: {
        cacheControl: true,
        maxAge: 3000 * 60 * 1000,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'client/dist'),
      exclude: ['/api/(.*)'],
    }),
    ConfigModule.forRoot(),
    CoreModule,
    AuthModule,
    OrganisationModule,
    ApplicationsModule,
    CourseBuilderModule,
    GroupsModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OrganisationActiveStatusGuard,
    },
  ],
})
export class AppModule {}
