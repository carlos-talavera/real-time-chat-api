import * as Joi from 'joi';

export const EnvironmentVariablesValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'staging')
    .default('development'),
  PORT: Joi.number().port().default(5000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().required(),
});
