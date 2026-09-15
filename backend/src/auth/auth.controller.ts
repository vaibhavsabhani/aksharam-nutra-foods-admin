import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, HttpRequest } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordDto, LoginDto, LogoutDto, RefreshDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') register(@Body() dto: RegisterDto, @Req() request: HttpRequest) {
    return this.authService.register(dto, request);
  }

  @Post('login') login(@Body() dto: LoginDto, @Req() request: HttpRequest) {
    return this.authService.login(dto, request);
  }

  @Post('refresh') refresh(@Body() dto: RefreshDto, @Req() request: HttpRequest) {
    return this.authService.refresh(dto.refreshToken, request);
  }

  @Post('logout') logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('forgot-password') forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password') resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(AuthGuard)
  @Get('me') me(@Req() request: HttpRequest & { user: { sub: number } }) {
    return this.authService.me(request.user.sub);
  }
}