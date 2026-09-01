export class N8nClient {
  private baseUrl = 'https://n8n.srv1871828.hstgr.cloud/webhook';
  private chatUrl = 'https://n8n.srv1871828.hstgr.cloud/webhook/4a108e85-050f-427e-aa03-784492ddfe89/chat';

  /**
   * Send live user query to n8n AI agent
   */
  async sendChatToAgent(query: string, sessionId: string = 'session_' + Date.now()): Promise<string | null> {
    console.log('[n8n Client] Sending Chat Query to n8n AI Agent:', query);
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
        return resText;
      }
    } catch (err) {
      console.warn('[n8n Client Warning] Direct chat trigger error:', err);
      return null;
    }
  }

  /**
   * Submit lead capture record to n8n active webhook & store locally
   */
  async submitLeadCapture(payload: Record<string, any>) {
    console.log('[n8n Client] Submitting Lead Capture Payload:', payload);
    
    // Save locally to localStorage so lead is never lost
    try {
      const existingLeads = JSON.parse(localStorage.getItem('igr_leads') || '[]');
      existingLeads.push(payload);
      localStorage.setItem('igr_leads', JSON.stringify(existingLeads));
    } catch (e) {
      console.warn('[n8n Client] Could not save to localStorage:', e);
    }

    const leadSummaryText = `NEW LEAD APPLICATION:\nParent Name: ${payload.user_name}\nStudent Name: ${payload.student_name}\nPhone: ${payload.user_phone}\nGrade: ${payload.grade}\nEmail: ${payload.email || 'N/A'}`;

    try {
      const response = await fetch(this.chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: leadSummaryText,
          sessionId: 'lead_' + Date.now(),
          leadData: payload
        })
      });
      const resText = await response.text();
      try {
        const json = JSON.parse(resText);
        return { success: true, response: json };
      } catch (e) {
        return { success: true, responseText: resText };
      }
    } catch (err) {
      console.warn('[n8n Client Warning] Lead ingestion error:', err);
      return { success: true, mock: true, data: payload };
    }
  }

  /**
   * Trigger WhatsApp syllabus delivery
   */
  async triggerWhatsAppSyllabus(payload: Record<string, any>) {
    console.log('[n8n Client] Triggering WhatsApp Syllabus Payload:', payload);
    try {
      const response = await fetch(`${this.baseUrl}/trigger_syllabus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      console.warn('[n8n Client Warning] WhatsApp trigger error:', err);
      return { success: true, mock: true, executionId: 'exec_wa_' + Date.now() };
    }
  }

  /**
   * Generate APPU AI voice audio from Hugging Face Space API (Gradio v6)
   */
  async generateAppuVoice(text: string): Promise<string | null> {
    console.log('[n8n Client] Requesting APPU Voice Synthesis from HuggingFace:', text);
    try {
      // Step 1: Trigger Gradio v6 Async Call
      const initRes = await fetch('https://shivatandav64-appu-voice-api.hf.space/gradio_api/call/generate_appu_speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [text] })
      });
      
      const initJson = await initRes.json();
      const eventId = initJson?.event_id;
      if (!eventId) return null;

      // Step 2: Stream Event Result
      const streamRes = await fetch(`https://shivatandav64-appu-voice-api.hf.space/gradio_api/call/generate_appu_speech/${eventId}`);
      const streamText = await streamRes.text();

      // Extract MP3 file URL from Gradio Event Stream
      const match = streamText.match(/"url":\s*"([^"]+)"/);
      if (match && match[1]) {
        console.log('[n8n Client] APPU Voice Audio Stream Ready:', match[1]);
        return match[1];
      }

      return null;
    } catch (err) {
      console.warn('[n8n Client Warning] APPU Voice API error:', err);
      return null;
    }
  }
}

export const n8nClient = new N8nClient();


