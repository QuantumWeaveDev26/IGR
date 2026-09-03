import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { buildServer } from '../src/app.js';
import { N8nClient, type N8nMessageEnvelope, type N8nMessageResponse } from '../src/services/n8n-client.js';
import { resetRateLimits } from '../src/security/rate-limit.js';

class MockN8nClient extends N8nClient {
  public lastEnvelope: N8nMessageEnvelope | null = null;
  public mockResponse: N8nMessageResponse = {
    text: 'Namaskara from APPU!',
    audioSource: 'data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAA',
    audioDurationMs: 4500
  };

  constructor() {
    super({ webhookUrl: 'https://mock.internal/webhook' });
  }

  async sendMessage(envelope: N8nMessageEnvelope): Promise<N8nMessageResponse> {
    this.lastEnvelope = envelope;
    return this.mockResponse;
  }
}

describe('IGR Dedicated Server Gateway (POST /api/appu/message)', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  test('Test 1: Send at least 5 messages in same session -> continuous chat, same stable sessionId, NO APPU 3-chat limit, NO login prompt', async () => {
    const mockN8n = new MockN8nClient();
    const app = buildServer({ NODE_ENV: 'test' }, mockN8n);
    const stableSessionId = 'sess_igr_user_12345';

    for (let i = 1; i <= 6; i++) {
      const res = await app.inject({
        method: 'POST',
        url: '/api/appu/message',
        payload: {
          message: `Question number ${i} about science`,
          language: 'en',
          includeAudio: true,
          sessionId: stableSessionId
        }
      });

      assert.equal(res.statusCode, 200);
      const body = JSON.parse(res.body);
      assert.equal(body.requestStatus, 'SUCCEEDED');
      assert.equal(body.text, 'Namaskara from APPU!');

      // Ensure ZERO APPU guest / login gating fields
      assert.equal(body.guest, undefined);
      assert.equal(body.guestSession, undefined);
      assert.equal(body.loginRequired, undefined);
      assert.equal(body.limit, undefined);

      // Verify server forwards stable sessionId and server-controlled clientApp: 'igr'
      assert.ok(mockN8n.lastEnvelope);
      assert.equal(mockN8n.lastEnvelope.sessionId, `igr_${stableSessionId}`);
      assert.equal(mockN8n.lastEnvelope.clientApp, 'igr');
    }
  });

  test('Test 2: English prompt ("hello appu") -> returns English text + audioSource', async () => {
    const mockN8n = new MockN8nClient();
    mockN8n.mockResponse = {
      text: 'Hello! I am Appu. What would you like to explore today?',
      audioSource: 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA',
      audioDurationMs: 3800
    };
    const app = buildServer({ NODE_ENV: 'test' }, mockN8n);

    const res = await app.inject({
      method: 'POST',
      url: '/api/appu/message',
      payload: {
        message: 'hello appu',
        language: 'en',
        includeAudio: true,
        sessionId: 'user_session_abc'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.requestStatus, 'SUCCEEDED');
    assert.equal(body.text, 'Hello! I am Appu. What would you like to explore today?');
    assert.ok(body.audioSource.startsWith('data:audio/mpeg;base64,'));
    assert.equal(body.audioDurationMs, 3800);

    assert.equal(mockN8n.lastEnvelope?.language, 'en');
    assert.equal(mockN8n.lastEnvelope?.clientApp, 'igr');
    assert.equal(mockN8n.lastEnvelope?.includeAudio, true);
  });

  test('Test 3: Kannada/Kanglish ("photosynthesis andre enu?") -> resolves language=kn, clientApp=igr, returns audioSource', async () => {
    const mockN8n = new MockN8nClient();
    mockN8n.mockResponse = {
      text: 'ನಮಸ್ಕಾರ! ಫೋಟೋಸಿಂಥೆಸಿಸ್ ಎಂದರೆ ಗಿಡಗಳು ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಬಳಸಿ ಆಹಾರ ತಯಾರಿಸುವ ಪ್ರಕ್ರಿಯೆ.',
      audioSource: 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA',
      audioDurationMs: 5200
    };
    const app = buildServer({ NODE_ENV: 'test' }, mockN8n);

    const res = await app.inject({
      method: 'POST',
      url: '/api/appu/message',
      payload: {
        message: 'photosynthesis andre enu?',
        language: 'kn',
        includeAudio: true,
        sessionId: 'user_session_abc'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.requestStatus, 'SUCCEEDED');
    assert.ok(body.audioSource.startsWith('data:audio/mpeg;base64,'));

    assert.equal(mockN8n.lastEnvelope?.language, 'kn');
    assert.equal(mockN8n.lastEnvelope?.clientApp, 'igr');
    assert.equal(mockN8n.lastEnvelope?.includeAudio, true);
  });

  test('Test 4: Kannada prompt ("nanage science thimba kasta") -> resolves language=kn', async () => {
    const mockN8n = new MockN8nClient();
    const app = buildServer({ NODE_ENV: 'test' }, mockN8n);

    const res = await app.inject({
      method: 'POST',
      url: '/api/appu/message',
      payload: {
        message: 'nanage science thimba kasta',
        language: 'kn',
        includeAudio: true,
        sessionId: 'user_session_abc'
      }
    });

    assert.equal(res.statusCode, 200);
    assert.equal(mockN8n.lastEnvelope?.language, 'kn');
    assert.equal(mockN8n.lastEnvelope?.clientApp, 'igr');
  });

  test('Test 5: includeAudio = false -> forwards includeAudio=false to n8n', async () => {
    const mockN8n = new MockN8nClient();
    mockN8n.mockResponse = {
      text: 'Text only response.',
      audioSource: null,
      audioDurationMs: null
    };
    const app = buildServer({ NODE_ENV: 'test' }, mockN8n);

    const res = await app.inject({
      method: 'POST',
      url: '/api/appu/message',
      payload: {
        message: 'Explain gravity',
        language: 'en',
        includeAudio: false,
        sessionId: 'user_session_abc'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.audioSource, null);
    assert.equal(mockN8n.lastEnvelope?.includeAudio, false);
    assert.equal(mockN8n.lastEnvelope?.clientApp, 'igr');
  });

  test('Validation: Missing or invalid sessionId rejected with 400', async () => {
    const mockN8n = new MockN8nClient();
    const app = buildServer({ NODE_ENV: 'test' }, mockN8n);

    const res = await app.inject({
      method: 'POST',
      url: '/api/appu/message',
      payload: {
        message: 'Hello',
        language: 'en'
      }
    });

    assert.equal(res.statusCode, 400);
  });

  test('Health route: GET /health returns 200 {"status":"ok"}', async () => {
    const app = buildServer({ NODE_ENV: 'test' });
    const res = await app.inject({
      method: 'GET',
      url: '/health'
    });

    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { status: 'ok' });
  });
});
