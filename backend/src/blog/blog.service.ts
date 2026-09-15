import { Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

type UploadedImage = { buffer: Buffer };
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadImage(file: UploadedImage) {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary is not configured');
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    return new Promise<{ url: string }>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'aksharam-nutra-foods/blog' },
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

  async create(dto: CreateBlogDto, userId?: number) {
    return this.prisma.blogPost.create({
      data: {
        title: dto.title,
        content: dto.content,
        coverImageUrl: dto.coverImageUrl,
        isShow: dto.isShow ?? true,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(onlyVisible?: boolean) {
    return this.prisma.blogPost.findMany({
      where: onlyVisible ? { isShow: true } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async update(id: number, dto: UpdateBlogDto) {
    await this.findOne(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.coverImageUrl !== undefined && { coverImageUrl: dto.coverImageUrl }),
        ...(dto.isShow !== undefined && { isShow: dto.isShow }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async toggleVisibility(id: number) {
    const post = await this.findOne(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        isShow: !post.isShow,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }
}
