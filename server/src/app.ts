import fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { loadConfig, type IgrServerConfig } from './config.js';
import { N8nClient } from './services/n8n-client.js';
import { appuRoutes } from './routes/appu.js';

export function buildServer(
  configOverrides?: Partial<IgrServerConfig>,
  n8nClientOverride?: N8nClient
): FastifyInstance {
  const config = loadConfig(configOverrides as any);
  const app = fastify({
    logger: config.NODE_ENV !== 'test'
  });

  // Allowed origins for CORS (no wildcard production CORS)
  const allowedOrigins = config.CORS_ALLOWED_ORIGIN.split(',').map((o) => o.trim());

  app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('CORS not allowed for this origin'), false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  });

  // Health check endpoint - returns immediately without contacting n8n
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  // Resolve N8nClient
  const n8nClient =
    n8nClientOverride ||
    new N8nClient({
      webhookUrl: config.N8N_APPU_WEBHOOK_URL,
      webhookSecret: config.N8N_APPU_WEBHOOK_SECRET,
      timeoutMs: config.N8N_APPU_TIMEOUT_MS
    });

  // Register dedicated IGR APPU route
  app.register(appuRoutes, {
    n8nClient
  });

  return app;
}
