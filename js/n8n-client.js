/**
 * n8n MCP & Webhook Integration Client for IGr Platform
 * Connects frontend triggers with n8n workflow automations.
 * Includes local fallback simulation for localhost/offline testing.
 */

class N8nClient {
  constructor() {
    // QuantumWeave n8n instance webhook endpoints
    this.baseUrl = window.N8N_WEBHOOK_BASE_URL || 'https://quantumweave.app.n8n.cloud/webhook';
    this.chatUrl = 'https://quantumweave.app.n8n.cloud/webhook/4a108e85-050f-427e-aa03-784492ddfe89/chat';
    this.useMock = false; // Attempt live webhook execution first, fallback to mock if offline
  }

  /**
   * Send live user message to APPU AI Agent chat trigger on n8n Cloud
   */
  async sendChatToAgent(query, sessionId = 'session_' + Date.now()) {
    console.log('[n8n MCP Client] Sending Chat Query to n8n AI Agent:', query);
    try {
      const response = await fetch(this.chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: query,
          sessionId: sessionId
        })
      });

      const resText = await response.text();
      try {
        const json = JSON.parse(resText);
        return json.output || json.text || json.message || null;
      } catch (e) {
        // SSE streaming or plain text response
        return resText;
      }
    } catch (err) {
      console.warn('[n8n Client Warning] Direct chat trigger error, fallback active:', err);
      return null;
    }
  }

  /**
   * Post lead capture onboarding record to n8n workflow: lead-ingestion / igr_lead_capture
   */
  async submitLeadCapture(payload) {
    console.log('[n8n MCP Client] Submitting Lead Capture Payload:', payload);

    if (this.useMock) {
      // Simulate network response
      await this._delay(600);
      return {
        success: true,
        workflowId: 'n8n_lead_ingestion_001',
        message: 'Lead record captured successfully in n8n CRM pipeline.',
        data: payload
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/lead-ingestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      console.warn('[n8n Client Warning] Network endpoint unavailable, using mock response:', err);
      return { success: true, mock: true, data: payload };
    }
  }

  /**
   * Trigger WhatsApp Syllabus Delivery Workflow: whatsapp-syllabus-sender / trigger_syllabus
   */
  async triggerWhatsAppSyllabus(payload) {
    console.log('[n8n MCP Client] Triggering WhatsApp Syllabus Delivery Payload:', payload);

    if (this.useMock) {
      await this._delay(800);
      return {
        success: true,
        executionId: 'exec_wa_' + Date.now(),
        workflowTag: 'whatsapp-syllabus-sender',
        status: 'DISPATCHED_TO_WHATSAPP_API',
        whatsappTemplate: 'cbse_syllabus_delivery_v1',
        details: {
          recipient: payload.user_phone,
          userName: payload.user_name,
          syllabus: payload.requested_syllabus,
          timestamp: new Date().toISOString()
        }
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/trigger_syllabus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      console.warn('[n8n Client Warning] Primary trigger_syllabus webhook endpoint unavailable, attempting lead-ingestion:', err);
      try {
        const altResponse = await fetch(`${this.baseUrl}/lead-ingestion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await altResponse.json();
      } catch (e2) {
        return { success: true, mock: true, executionId: 'exec_wa_dispatch_' + Date.now() };
      }
    }
  }

  /**
   * Trigger Discovery Call / Early Access Booking: discovery-call-booking
   */
  async submitDiscoveryBooking(payload) {
    console.log('[n8n MCP Client] Submitting Discovery Call Booking Payload:', payload);

    if (this.useMock) {
      await this._delay(700);
      return {
        success: true,
        bookingId: 'BK-' + Math.floor(100000 + Math.random() * 900000),
        status: 'CONFIRMED',
        message: 'Discovery Call booked. Instant WhatsApp confirmation sent.'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/discovery-call-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      console.warn('[n8n Client Warning] Booking API call failed, fallback mock active:', err);
      return { success: true, mock: true };
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

window.n8nClient = new N8nClient();
