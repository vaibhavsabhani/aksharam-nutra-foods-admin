import {
  Body,
  BadRequestException,
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(AuthGuard)
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: { buffer: Buffer }) {
    if (!file) throw new BadRequestException('An image file is required');
    return this.blogService.uploadImage(file);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateBlogDto, @Req() req: { user: { sub: number } }) {
    return this.blogService.create(dto, req.user?.sub);
  }

  @Get()
  findAll(@Query('onlyVisible') onlyVisible?: string) {
    const isOnlyVisible = onlyVisible === 'true' || onlyVisible === '1';
    return this.blogService.findAll(isOnlyVisible);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/toggle-visibility')
  toggleVisibility(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.toggleVisibility(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
