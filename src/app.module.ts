import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/shared/auth/auth.module';
import { EnvironmentVariablesValidationSchema } from 'src/shared/config/models/env-variables';
import { DatabaseModule } from 'src/shared/datasource/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validationSchema: EnvironmentVariablesValidationSchema,
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
