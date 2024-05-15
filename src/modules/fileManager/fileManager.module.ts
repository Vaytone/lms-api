import { Global, Module } from '@nestjs/common';
import { FileManagerService } from './fileManager.service';
import { FileManagerController } from './fileManager.controller';

@Global()
@Module({
  providers: [FileManagerService],
  controllers: [FileManagerController],
  imports: [],
  exports: [FileManagerService],
})
export class FileManagerModule {}
