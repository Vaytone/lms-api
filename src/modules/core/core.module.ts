import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PrismaModule } from '../../db/prisma.module';
import { FileManagerModule } from '../fileManager/fileManager.module';

@Global()
@Module({
  imports: [
    NestjsFormDataModule,
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
    FileManagerModule,
  ],
  exports: [JwtModule, PrismaModule],
})
export class CoreModule {}
