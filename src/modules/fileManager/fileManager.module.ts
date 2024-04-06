import { Global, Module } from '@nestjs/common';
import { FileManagerService } from './fileManager.service';
import { FreeAccess } from '../../shared/decorator/freeAccess.decorator';
import { Public } from '../../shared/decorator/public.decorator';
import { FileManagerController } from './fileManager.controller';

@Global()
@FreeAccess()
@Public()
@Module({
  providers: [FileManagerService],
  controllers: [FileManagerController],
  imports: [],
  exports: [FileManagerService],
})
export class FileManagerModule {}
