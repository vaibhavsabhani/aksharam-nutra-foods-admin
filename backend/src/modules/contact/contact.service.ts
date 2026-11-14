import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { resolveLocationFromIp } from './utils/geolocation.util';
import { ContactStatus, Prisma } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Public contact submission endpoint for landing pages.
   * Receives the 4 fields (firstName, lastName, email, message) and
   * automatically resolves IP address and Geolocation details.
   */
  async create(dto: CreateContactDto, clientIp: string) {
    const finalIp = dto.ipAddress?.trim() || clientIp || '127.0.0.1';

    // Auto-resolve geolocation from IP address
    const geo = await resolveLocationFromIp(finalIp);

    const contact = await this.prisma.contact.create({
      data: {
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        email: dto.email.trim().toLowerCase(),
        message: dto.message.trim(),
        ipAddress: finalIp,
        city: dto.city || geo.city || null,
        region: dto.region || geo.region || null,
        country: dto.country || geo.country || null,
        countryCode: dto.countryCode || geo.countryCode || null,
        latitude: dto.latitude !== undefined ? dto.latitude : (geo.latitude ?? null),
        longitude: dto.longitude !== undefined ? dto.longitude : (geo.longitude ?? null),
        status: ContactStatus.PENDING,
      },
    });

    return {
      success: true,
      message: 'Your inquiry has been successfully submitted.',
      data: contact,
    };
  }

  /**
   * Admin: List contact inquiries with optional filtering, search, and pagination.
   */
  async findAll(query?: QueryContactDto) {
    const where: Prisma.ContactWhereInput = {};

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.search && query.search.trim().length > 0) {
      const term = query.search.trim();
      where.OR = [
        { firstName: { contains: term, mode: 'insensitive' } },
        { lastName: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
        { message: { contains: term, mode: 'insensitive' } },
        { city: { contains: term, mode: 'insensitive' } },
        { region: { contains: term, mode: 'insensitive' } },
        { country: { contains: term, mode: 'insensitive' } },
        { ipAddress: { contains: term, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.contact.count({ where });

    const take = query?.limit ? Number(query.limit) : undefined;
    const skip =
      query?.page && query?.limit
        ? (Number(query.page) - 1) * Number(query.limit)
        : undefined;

    const contacts = await this.prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });

    return {
      contacts,
      total,
      page: query?.page ? Number(query.page) : 1,
      limit: query?.limit ? Number(query.limit) : total,
    };
  }

  /**
   * Admin: Summary metrics for contact inquiries.
   */
  async getStats() {
    const [total, pending, contacted, resolved, archived] = await Promise.all([
      this.prisma.contact.count(),
      this.prisma.contact.count({ where: { status: ContactStatus.PENDING } }),
      this.prisma.contact.count({ where: { status: ContactStatus.CONTACTED } }),
      this.prisma.contact.count({ where: { status: ContactStatus.RESOLVED } }),
      this.prisma.contact.count({ where: { status: ContactStatus.ARCHIVED } }),
    ]);

    return {
      total,
      pending,
      contacted,
      resolved,
      archived,
    };
  }

  /**
   * Admin: Find single contact inquiry by ID.
   */
  async findOne(id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`Contact inquiry #${id} not found`);
    }

    return contact;
  }

  /**
   * Admin: Update inquiry status and optional notes.
   */
  async updateStatus(id: number, dto: UpdateContactStatusDto) {
    await this.findOne(id);

    return this.prisma.contact.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
  }

  /**
   * Admin: Delete inquiry by ID.
   */
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
