import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await this.$connect();
        return;
      } catch (error) {
        if (attempt === maxAttempts || !this.isRetryableConnectionError(error)) {
          throw error;
        }

        const delayMs = 1000 * 2 ** (attempt - 1);
        console.warn(`Database connection attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
        await this.delay(delayMs);
      }
    }
  }

  private isRetryableConnectionError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'errorCode' in error && error.errorCode === 'P1001';
  }

  private delay(delayMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}