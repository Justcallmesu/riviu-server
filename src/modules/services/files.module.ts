import { Global, Module } from '@nestjs/common';
import { FilesController } from './file.controller';
import { FileService } from './file.service';

@Global()
@Module({
  controllers: [FilesController],
  providers: [FileService],
  exports: [FileService],
})
export class FilesModule {}
