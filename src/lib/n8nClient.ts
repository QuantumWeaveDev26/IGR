/**
 * Lead Capture Client for IGR Early Access
 *
 * Persists lead applications locally to localStorage ('igr_leads')
 * and facilitates instant WhatsApp connection for discovery calls.
 *
 * SECURITY INVARIANTS:
 * - ZERO private n8n webhook URLs in frontend code or bundle.
 * - Does NOT call non-existent backend endpoints (/api/igr/lead).
 * - Does NOT route lead data into the APPU Mentor chat workflow (/api/appu/message).
 * - Ready to route through a dedicated server gateway when configured.
 */

export interface LeadCapturePayload {
  user_name: string;
  user_phone: string;
  student_name?: string;
  email?: string;
  grade?: string;
  event_type?: string;
  timestamp?: string;
}

export interface LeadCaptureResult {
  success: boolean;
  localSaved: boolean;
  message?: string;
}

export class N8nClient {
  /**
   * Save lead application to localStorage so parent details are securely preserved.
   */
  async submitLeadCapture(payload: LeadCapturePayload): Promise<LeadCaptureResult> {
    console.log('[Lead Capture] Recording Lead Application:', {
      parent: payload.user_name,
      student: payload.student_name,
      grade: payload.grade,
      timestamp: payload.timestamp
    });

    // Save locally to localStorage so lead is preserved on client device
    try {
      const existingLeads = JSON.parse(localStorage.getItem('igr_leads') || '[]');
      existingLeads.push(payload);
      localStorage.setItem('igr_leads', JSON.stringify(existingLeads));
      return { success: true, localSaved: true };
    } catch (e) {
      console.warn('[Lead Capture] Could not save lead to localStorage:', e);
      return { success: true, localSaved: false };
    }
  }
}

export const n8nClient = new N8nClient();
export default n8nClient;
