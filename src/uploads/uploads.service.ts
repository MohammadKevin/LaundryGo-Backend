import {
  BadRequestException,
  Injectable,
} from '@nestjs/common'

import { ConfigService } from '@nestjs/config'

import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class UploadsService {
  constructor(
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name:
        this.configService.get<string>(
          'CLOUDINARY_CLOUD_NAME',
        ),
      api_key:
        this.configService.get<string>(
          'CLOUDINARY_API_KEY',
        ),
      api_secret:
        this.configService.get<string>(
          'CLOUDINARY_API_SECRET',
        ),
    })
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'laundrygo',
          },
          (error, result) => {
            if (error) {
              return reject(
                new BadRequestException(
                  'Upload failed',
                ),
              )
            }

            resolve(result)
          },
        )
        .end(file.buffer)
    })
  }
}