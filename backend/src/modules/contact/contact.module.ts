import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ContactController],
  providers: [ContactService, AuthGuard, JwtService],
  exports: [ContactService],
})
export class ContactModule {}
