import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ContactStatus } from '@prisma/client';

export class UpdateContactStatusDto {
  @IsEnum(ContactStatus, {
    message: 'Status must be one of PENDING, CONTACTED, RESOLVED, ARCHIVED',
  })
  status!: ContactStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
