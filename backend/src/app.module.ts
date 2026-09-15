import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		JwtModule.register({}),
		PrismaModule,
		AuthModule,
		BlogModule,
	],
})
export class AppModule {}