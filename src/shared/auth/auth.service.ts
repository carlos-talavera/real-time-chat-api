import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/api/users/models/user.model';
import { UserService } from 'src/api/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const result =
      typeof user.toObject === 'function' ? user.toObject() : { ...user };

    delete result.password;

    return result;
  }

  public async login(user: UserDocument) {
    const userId = user._id.toString();
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(userId, user.username),
      this.getRefreshToken(userId, user.username),
    ]);
    const tokens = { accessToken, refreshToken };
    await this.userService.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  public async register(username: string, email: string, password: string) {
    const user = await this.userService.create(username, email, password);

    const userId = user._id.toString();
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(userId, user.username),
      this.getRefreshToken(userId, user.username),
    ]);
    const tokens = { accessToken, refreshToken };
    await this.userService.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  public async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }

    const id = user._id?.toString() || userId;
    const accessToken = await this.getAccessToken(id, user.username);

    const refreshTokenIsExpiringSoon =
      this.checkIfRefreshTokenIsExpiringSoon(user);

    if (refreshTokenIsExpiringSoon) {
      const newRefreshToken = await this.getRefreshToken(id, user.username);
      await this.userService.updateRefreshToken(id, newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    }

    return { accessToken, refreshToken };
  }

  public async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
    return { message: 'Logout successful' };
  }

  private async getAccessToken(userId: string, username: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        id: userId,
        username,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      },
    );

    return accessToken;
  }

  private async getRefreshToken(userId: string, username: string) {
    const refreshToken = await this.jwtService.signAsync(
      {
        id: userId,
        username,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      },
    );

    return refreshToken;
  }

  private checkIfRefreshTokenIsExpiringSoon(user: User) {
    const refreshTokenExpiresAt = new Date(user.refreshTokenExpiresAt); // The date is in UTC
    const now = new Date(); // Important that the server is in UTC as well

    const timeDifference = refreshTokenExpiresAt.getTime() - now.getTime();
    const DIFFERENCE_LIMIT_IN_MILLISECONDS = 1000 * 60 * 60; // 1 hour

    if (timeDifference <= DIFFERENCE_LIMIT_IN_MILLISECONDS) {
      return true;
    }

    return false;
  }
}
