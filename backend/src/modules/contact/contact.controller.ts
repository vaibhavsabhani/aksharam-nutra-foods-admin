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
import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { extractClientIp } from './utils/geolocation.util';
import { AuthGuard } from '../auth/auth.guard';

@Controller(['contacts', 'contact'])
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Public POST endpoint for landing pages.
   * Accepts { firstName, lastName, email, message } (plus optional client overrides).
   * Automatically captures client IP and location info.
   */
  @Post()
  create(@Body() dto: CreateContactDto, @Req() req: Request) {
    const clientIp = extractClientIp(req);
    return this.contactService.create(dto, clientIp);
  }

  /**
   * Admin: Summary metrics for contacts.
   * Place before :id route so 'stats' is not parsed as an ID.
   */
  @UseGuards(AuthGuard)
  @Get('stats')
  getStats() {
    return this.contactService.getStats();
  }

  /**
   * Admin: Retrieve all contact inquiries with optional filtering and search.
   */
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: QueryContactDto) {
    return this.contactService.findAll(query);
  }

  /**
   * Admin: Retrieve single contact inquiry.
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  /**
   * Admin: Update inquiry status and admin notes.
   */
  @UseGuards(AuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactStatusDto,
  ) {
    return this.contactService.updateStatus(id, dto);
  }

  /**
   * Admin: Delete inquiry.
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.remove(id);
  }
}
