import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

