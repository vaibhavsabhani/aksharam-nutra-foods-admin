import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateBlogDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	@IsOptional()
	title?: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	content?: string;

	@IsUrl()
	@IsOptional()
	coverImageUrl?: string;

	@IsBoolean()
	@IsOptional()
	isShow?: boolean;
}
