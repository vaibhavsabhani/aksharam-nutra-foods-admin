import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTestimonialDto, authorId?: number) {
    return this.prisma.testimonial.create({
      data: { quote: dto.quote, author: dto.author, isShow: dto.isShow ?? true, authorId },
    });
  }

  findAll(onlyVisible?: boolean) {
    return this.prisma.testimonial.findMany({
      where: onlyVisible ? { isShow: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return testimonial;
  }

  async update(id: number, dto: UpdateTestimonialDto) {
    await this.findOne(id);
    return this.prisma.testimonial.update({
      where: { id },
      data: {
        ...(dto.quote !== undefined && { quote: dto.quote }),
        ...(dto.author !== undefined && { author: dto.author }),
        ...(dto.isShow !== undefined && { isShow: dto.isShow }),
      },
    });
  }

  async toggleVisibility(id: number) {
    const testimonial = await this.findOne(id);
    return this.prisma.testimonial.update({
      where: { id },
      data: { isShow: !testimonial.isShow },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.testimonial.delete({ where: { id } });
  }
}