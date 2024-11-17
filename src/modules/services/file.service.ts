import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import * as fs from 'fs';
import { Movies } from '../public/movies/movies.entity';

@Injectable()
export class FileService {
  async saveFile(movie: Movies, file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException();

    if (!fs.existsSync('files/images')) {
      fs.mkdirSync('files/images', { recursive: true });
    }

    const fileName = this.generateFileName(movie, file);

    const ws = fs.createWriteStream(`files/images/${fileName}`);
    ws.write(file.buffer);

    return fileName;
  }

  async deleteFile(fileName: string): Promise<void> {
    if (!fileName) throw new BadRequestException();

    const filePath = `files/images/${fileName}`;

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  private generateFileName(movie: Movies, file: Express.Multer.File): string {
    return `${dayjs().format('YYYY-MM-DD-HH-mm-ss')}-${movie.name}-${movie.authorId}.${file.mimetype.split('/')[1]}`;
  }
}
