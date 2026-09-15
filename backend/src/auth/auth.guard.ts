import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string }; user?: unknown }>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Missing bearer token');

    try {
      request.user = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET ?? 'change-me-in-production',
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}