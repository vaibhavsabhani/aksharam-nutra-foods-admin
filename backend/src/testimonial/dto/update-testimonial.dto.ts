import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTestimonialDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  quote?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  author?: string;

  @IsBoolean()
  @IsOptional()
  isShow?: boolean;
}