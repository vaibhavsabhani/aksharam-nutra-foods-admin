import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto';

const REFRESH_TOKEN_DAYS = 30;
const RESET_TOKEN_MINUTES = 30;
export type HttpRequest = { ip?: string; headers: Record<string, string | string[] | undefined> };

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto, request: HttpRequest) {
    const email = dto.email.toLowerCase().trim();
    if (await this.prisma.user.findUnique({ where: { email } })) throw new ConflictException('Email is already registered');
    const user = await this.prisma.user.create({ data: { name: dto.name.trim(), email, passwordHash: await bcrypt.hash(dto.password, 12) } });
    return this.issueSession(user.id, user.email, user.role, request);
  }

  async login(dto: LoginDto, request: HttpRequest) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase().trim() } });
    if (!user || user.status !== 'ACTIVE' || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date(), lastLoginIp: request.ip } });
    return this.issueSession(user.id, user.email, user.role, request);
  }

  async refresh(token: string, request: HttpRequest) {
    const tokenHash = this.hash(token);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
    if (!stored || stored.revokedAt || stored.expiresAt <= new Date() || stored.user.status !== 'ACTIVE') throw new UnauthorizedException('Invalid refresh token');
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    return this.issueSession(stored.user.id, stored.user.email, stored.user.role, request);
  }

  async logout(token?: string) {
    if (token) await this.prisma.refreshToken.updateMany({ where: { tokenHash: this.hash(token), revokedAt: null }, data: { revokedAt: new Date() } });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    const response: { message: string; resetToken?: string } = { message: 'If an account exists, a password reset link has been sent.' };
    if (!user || user.status !== 'ACTIVE') return response;
    const token = randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({ data: { tokenHash: this.hash(token), userId: user.id, expiresAt: new Date(Date.now() + RESET_TOKEN_MINUTES * 60_000) } });
    if (process.env.NODE_ENV !== 'production') response.resetToken = token;
    return response;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hash(dto.token);
    const resetToken = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) throw new UnauthorizedException('Invalid or expired reset token');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash, passwordChangedAt: new Date() } }),
      this.prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
      this.prisma.refreshToken.updateMany({ where: { userId: resetToken.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    return { message: 'Password reset successfully' };
  }

  me(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true, status: true, isEmailVerified: true, createdAt: true } });
  }

  private async issueSession(userId: number, email: string, role: string, request: HttpRequest) {
    const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as `${number}${'s' | 'm' | 'h' | 'd'}`;
    const accessToken = await this.jwt.signAsync({ sub: userId, email, role }, { secret: process.env.JWT_ACCESS_SECRET ?? 'change-me-in-production', expiresIn: accessExpiresIn });
    const refreshToken = randomBytes(48).toString('hex');
    const userAgent = request.headers['user-agent'];
    await this.prisma.refreshToken.create({ data: { tokenHash: this.hash(refreshToken), userId, expiresAt: new Date(Date.now() + REFRESH_TOKEN_DAYS * 86_400_000), ipAddress: request.ip, userAgent: typeof userAgent === 'string' ? userAgent : undefined } });
    return { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: accessExpiresIn };
  }

  private hash(value: string) { return createHash('sha256').update(value).digest('hex'); }
}