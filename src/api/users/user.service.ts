import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as ms from 'ms';
import { User, UserDocument } from 'src/api/users/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  public async create(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException(
        existingUser.username === username
          ? 'Username already exists'
          : 'Email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });

    return user.save();
  }

  public async findOne(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ username }).exec();
    return user || undefined;
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user || undefined;
  }

  public async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;

    const expirationString = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION',
    );
    const expirationInMilliseconds = ms(expirationString);

    const refreshTokenExpiresAt = new Date(
      new Date().getTime() + expirationInMilliseconds,
    );

    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt: hashedRefreshToken ? refreshTokenExpiresAt : null,
    });
  }
}
