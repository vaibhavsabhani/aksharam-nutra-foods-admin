import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';

@Module({
  controllers: [TestimonialController],
  providers: [TestimonialService, AuthGuard, JwtService],
})
export class TestimonialModule {}