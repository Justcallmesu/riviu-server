import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller({ path: 'files' })
export class FilesController {
  @Get(':filepath')
  async getFile(@Param('filepath') filepath: string, @Res() res: Response) {
    return res.sendFile(filepath, { root: './files/images' });
  }
}
