import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
const multer = require('multer'); 
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UploadsService } from './uploads.service';
import { ApiBody, ApiConsumes, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post(':context')
  @ApiParam({
    name: 'context',
    required: true,
    description: 'Contexto do upload (users, products, documents, etc)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: (req, file, callback) => {
          const context = req.params.context || 'general';
          const uploadPath = join(__dirname, '../../uploads', context);

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const ext = extname(file.originalname).toLowerCase();
        if (!allowedTypes.test(ext)) {
          return callback(new BadRequestException('Tipo de arquivo inválido!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@Param('context') context: string, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado!');
    const fileUrl = this.uploadsService.getFileUrl(context, file.filename);
    return {
      message: 'Upload realizado com sucesso!',
      url: fileUrl,
      context,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
