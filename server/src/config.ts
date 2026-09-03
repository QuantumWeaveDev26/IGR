import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.preprocess(
    (val) => (val === '' || val === undefined ? 3000 : Number(val)),
    z.number().int().min(1).max(65535)
  ).default(3000),
  HOST: z.string().default('0.0.0.0'),
  CORS_ALLOWED_ORIGIN: z.string().default('https://igr.academy'),
  N8N_APPU_WEBHOOK_URL: z.string().url().default('https://n8n.srv999745.hstgr.cloud/webhook/appu-chat'),
  N8N_APPU_WEBHOOK_SECRET: z.string().min(8).optional(),
  N8N_APPU_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000)
});

export type IgrServerConfig = z.infer<typeof configSchema>;

export function loadConfig(envOverrides?: Partial<Record<string, string | undefined>>): IgrServerConfig {
  const source = {
    ...process.env,
    ...(envOverrides || {})
  };

  const parsed = configSchema.safeParse(source);
  if (!parsed.success) {
    console.error('Invalid server configuration:', parsed.error.format());
    throw new Error('Invalid server configuration');
  }

  return parsed.data;
}
