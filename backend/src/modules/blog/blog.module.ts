import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [BlogController],
  providers: [BlogService, AuthGuard, JwtService],
  exports: [BlogService],
})
export class BlogModule {}
