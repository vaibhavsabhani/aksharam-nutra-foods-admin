import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsUrl()
  @IsOptional()
  coverImageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isShow?: boolean;
}
