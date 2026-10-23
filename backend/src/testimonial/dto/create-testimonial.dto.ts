import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @IsNotEmpty()
  quote!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author!: string;

  @IsBoolean()
  @IsOptional()
  isShow?: boolean;
}