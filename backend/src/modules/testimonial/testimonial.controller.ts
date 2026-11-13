import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialService } from './testimonial.service';

@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateTestimonialDto, @Req() req: { user: { sub: number } }) {
    return this.testimonialService.create(dto, req.user?.sub);
  }

  @Get()
  findAll(@Query('onlyVisible') onlyVisible?: string) {
    return this.testimonialService.findAll(onlyVisible === 'true' || onlyVisible === '1');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testimonialService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/toggle-visibility')
  toggleVisibility(@Param('id', ParseIntPipe) id: number) {
    return this.testimonialService.toggleVisibility(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.testimonialService.remove(id);
  }
}