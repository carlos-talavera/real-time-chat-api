import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/shared/auth/auth.service';
import { LoginDto } from 'src/shared/auth/dto/login.dto';
import { RegisterDto } from 'src/shared/auth/dto/register.dto';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { AuthUser } from 'src/shared/auth/models/auth-user.model';
import { RefreshTokenGuard } from 'src/shared/auth/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }

    return this.authService.login(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  public refreshTokens(@Request() req: { user: AuthUser }) {
    const userId = req.user.id;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  public logout(@Request() req: { user: AuthUser }) {
    return this.authService.logout(req.user.id);
  }
}
