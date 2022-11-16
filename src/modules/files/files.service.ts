import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import FilesDTO from './dto/files.dto';

@Injectable()
export default class FilesService {
  constructor(private readonly configService: ConfigService) {}

  private readonly S3Instance = new S3({
    credentials: {
      accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
    },
  });

  async uploadToS3(files: Express.Multer.File[]): Promise<FilesDTO[]> {
    const returningFiles: { name: string; location: string }[] = [];

    const upload = async (originalname: string, buffer: Buffer) => {
      const { Location } = await this.S3Instance.upload({
        Bucket: this.configService.get('S3_FILES_BUCKET_NAME'),
        Key: originalname,
        Body: buffer,
      }).promise();

      return Location;
    };

    if (!Array.isArray(files)) {
      try {
        const location = await upload(
          (files as Express.Multer.File).originalname,
          (files as Express.Multer.File).buffer,
        );

        return [
          {
            location,
            name: (files as Express.Multer.File).originalname,
          },
        ];
      } catch (error) {
        throw new InternalServerErrorException(
          'There was an error on file uploading: ' + error,
        );
      }
    } else {
      for (const { originalname, buffer } of files) {
        try {
          const location = await upload(originalname, buffer);

          returningFiles.push({
            name: originalname,
            location,
          });
        } catch (error) {
          throw new InternalServerErrorException(
            'There was an error on file uploading: ' + error,
          );
        }
      }
    }

    return returningFiles;
  }
}
