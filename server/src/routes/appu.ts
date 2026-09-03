import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';
import type { N8nClient, N8nMessageEnvelope } from '../services/n8n-client.js';
import { checkIpRateLimit } from '../security/rate-limit.js';

export interface AppuRouteOptions {
  n8nClient: N8nClient;
}

const messageRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message cannot exceed 2000 characters'),
  language: z
    .enum(['en', 'kn'])
    .optional()
    .default('en'),
  includeAudio: z
    .boolean()
    .optional()
    .default(true),
  sessionId: z
    .string()
    .trim()
    .min(1, 'sessionId is required')
    .max(128, 'sessionId too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid sessionId format')
});

function detectLanguageIntent(message: string, uiLang: string = 'en'): string {
  const msgLower = (message || '').toLowerCase();

  // Explicit English request overrides UI
  if (/\b(in english|explain in english|speak in english|reply in english)\b/i.test(msgLower)) {
    return 'en';
  }

  // Explicit Kannada request
  if (/\b(in kannada|kannadadalli|kannada dalli)\b/i.test(msgLower)) {
    return 'kn';
  }

  // Kannada Unicode script
  if (/[\u0C80-\u0CFF]/.test(message)) {
    return 'kn';
  }

  // Common Kanglish words
  if (/\b(enu|hege|beku|kasta|nanage|nange|namma|nimma|yake|matte|gothu|gottilla|andre|yenu|houdu|illa|tumba|thimba)\b/i.test(msgLower)) {
    return 'kn';
  }

  return uiLang === 'kn' ? 'kn' : 'en';
}

export const appuRoutes: FastifyPluginAsync<AppuRouteOptions> = async (fastify, opts) => {
  fastify.post('/api/appu/message', async (request, reply) => {
    const parseResult = messageRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: {
          code: 'bad_request',
          message: 'Invalid message payload',
          details: parseResult.error.flatten().fieldErrors
        }
      });
    }

    const { message, language, includeAudio, sessionId } = parseResult.data;

    // IP rate limiting
    const clientIp = (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      request.ip ||
      '127.0.0.1'
    ).trim();

    try {
      checkIpRateLimit(clientIp);
    } catch (err: any) {
      return reply.status(429).send({
        error: {
          code: 'rate_limited',
          message: err.message
        }
      });
    }

    const effectiveLanguage = detectLanguageIntent(message, language);
    const requestId = crypto.randomUUID();

    // Server authoritatively sets clientApp: 'igr'
    const envelope: N8nMessageEnvelope = {
      requestId,
      action: 'sendMessage',
      channel: 'website',
      sessionId: `igr_${sessionId}`,
      chatInput: message,
      message,
      language: effectiveLanguage,
      includeAudio,
      clientApp: 'igr',
      mentorContext: {
        mode: 'guest',
        primaryLanguage: effectiveLanguage,
        personalizationEnabled: false
      }
    };

    try {
      const response = await opts.n8nClient.sendMessage(envelope);

      return reply.status(200).send({
        requestId,
        requestStatus: 'SUCCEEDED',
        text: response.text,
        audioSource: response.audioSource || null,
        audioDurationMs: response.audioDurationMs || null
      });
    } catch (err: any) {
      console.error('[IGR APPU Route] Forwarding error:', err);
      return reply.status(503).send({
        error: {
          code: 'service_unavailable',
          message: 'AI mentor service is temporarily unavailable. Please try again.'
        }
      });
    }
  });
};
