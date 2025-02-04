import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileManagerRoutes } from '../../constants/routes/fileManager.routes';
import { FileManagerService } from './fileManager.service';
import { Public } from 'src/shared/decorator/public.decorator';
import { FreeAccess } from '../../shared/decorator/freeAccess.decorator';
import { Response } from 'express';
import { InvalidDataException } from '../../exceptions/invalidData.exception';
import { DefaultErrorsEnum } from '../../constants/errors/default.errors';

@Public()
@FreeAccess()
@Controller(FileManagerRoutes.Base)
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Get(FileManagerRoutes.GetImg)
  async getPhoto(@Param('key') key: string, @Param('dir') dir: string, @Res({ passthrough: true }) res: Response) {
    try {
      const result = await this.fileManagerService.getPhoto(`${dir}/${key}`);
      res.setHeader('Cache-Control', 'public, max-age=2592000');

      res.end(result);
    } catch (err) {
      console.log(err);
      throw new InvalidDataException(DefaultErrorsEnum.SomethingWentWrong);
    }
  }
}
