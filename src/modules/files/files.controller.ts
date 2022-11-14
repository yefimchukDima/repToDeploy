import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import JWTGuard from '../auth/guards/jwt.guard';
import FilesDTO from './dto/files.dto';
import FilesService from './files.service';

@Controller('files')
export default class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JWTGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({
    summary: 'Uploads a file to S3',
    description: `
        ------Request Specs------

        Content-Type: multipart/form-data;
        **Keys must be equal if it's more than one file!!!**
    `,
  })
  @ApiResponse({
    type: [FilesDTO],
  })
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<FilesDTO[]> {
    const res = await this.filesService.uploadToS3(files);

    return res;
  }
}
