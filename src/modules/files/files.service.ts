import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import FilesDTO from './dto/files.dto';

@Injectable()
export default class FilesService {
  private readonly S3Instance = new S3({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  async uploadToS3(files: Express.Multer.File[]): Promise<FilesDTO[]> {
    const returningFiles: { name: string; location: string }[] = [];

    for (const { originalname, buffer } of files) {
      try {
        const { Location } = await this.S3Instance.upload({
          Bucket: process.env.S3_FILES_BUCKET_NAME,
          Key: originalname,
          Body: buffer,
        }).promise();

        returningFiles.push({
          name: originalname,
          location: Location,
        });
      } catch (error) {
        throw new InternalServerErrorException(
          'There was an error on file uploading: ' + error,
        );
      }
    }

    return returningFiles;
  }
}
