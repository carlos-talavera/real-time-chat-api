import * as Joi from 'joi';

export const EnvironmentVariablesValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'staging')
    .default('development'),
  PORT: Joi.number().port().default(5000),
});
