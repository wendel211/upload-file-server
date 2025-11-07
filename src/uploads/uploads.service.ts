import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  getFileUrl(context: string, filename: string): string {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${context}/${filename}`;
  }
}
