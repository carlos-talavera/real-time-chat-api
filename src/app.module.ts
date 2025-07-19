import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentVariablesValidationSchema } from 'src/shared/config/models/env-variables';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validationSchema: EnvironmentVariablesValidationSchema,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
