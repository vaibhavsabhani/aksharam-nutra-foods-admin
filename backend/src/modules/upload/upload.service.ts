import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export type UploadedFileBuffer = { buffer: Buffer };

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(
    file: UploadedFileBuffer,
    folder = 'aksharam-nutra-foods',
  ): Promise<{ url: string }> {
    if (!file || !file.buffer) {
      throw new BadRequestException('A valid file buffer is required');
    }

    const cloudName =
      this.configService.get<string>('cloudinary.cloudName') ??
      process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey =
      this.configService.get<string>('cloudinary.apiKey') ??
      process.env.CLOUDINARY_API_KEY;
    const apiSecret =
      this.configService.get<string>('cloudinary.apiSecret') ??
      process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new BadRequestException('Cloudinary credentials are not configured');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    return new Promise<{ url: string }>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(error ?? new Error('Cloudinary upload failed'));
            return;
          }
          resolve({ url: result.secure_url });
        },
      );
      upload.end(file.buffer);
    });
  }
}

