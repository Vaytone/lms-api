import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileManagerModule } from '../fileManager/fileManager.module';

@Global()
@Module({
  imports: [
    NestjsFormDataModule,
    JwtModule.register({
      global: true,
    }),
  ],
  exports: [JwtModule],
})
export class CoreModule {}
