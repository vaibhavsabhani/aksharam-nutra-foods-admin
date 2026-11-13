import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService, UploadedFileBuffer } from '../upload/upload.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async uploadImage(file: UploadedFileBuffer) {
    return this.uploadService.uploadImage(file, 'aksharam-nutra-foods/blog');
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
