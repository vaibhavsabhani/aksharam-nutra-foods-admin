import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(100, { message: 'First name cannot exceed 100 characters' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(100, { message: 'Last name cannot exceed 100 characters' })
  lastName!: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  @MaxLength(255)
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @MaxLength(5000, { message: 'Message cannot exceed 5000 characters' })
  message!: string;

  // Optional manual overrides / client-provided data
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
