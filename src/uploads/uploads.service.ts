import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  getFileUrl(filename: string): string {
    return `http://localhost:3000/uploads/${filename}`;
  }
}
