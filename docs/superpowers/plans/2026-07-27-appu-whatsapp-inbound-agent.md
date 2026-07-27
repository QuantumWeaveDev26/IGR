# APPU WhatsApp Inbound Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated n8n workflow that receives Meta WhatsApp Cloud API messages and sends a natural, first-person APPU learning-mentor reply.

**Architecture:** A new, active n8n workflow provides separate GET verification and POST event paths at one Meta callback path. The POST path filters status callbacks, normalizes every inbound text message, passes it to an APPU AI Agent with phone-number-scoped memory, and sends the resulting text with WhatsApp Cloud API. The existing landing-page workflow remains unchanged.

**Tech Stack:** n8n Cloud, Meta WhatsApp Cloud API, existing OpenAI credential and APPU system prompt, n8n Simple Memory, n8n WhatsApp Business Cloud node.

## Global Constraints

- Keep the inbound workflow separate from workflow `6iFu44EGcnkl7wzV` and do not change its landing-page chat, discovery-call, calendar, or scheduled-digest routes.
- Store Meta tokens, app secrets, and verify tokens only in n8n credentials or n8n variables; never write them to this repository, node labels, or chat messages.
- Use each sender's WhatsApp number as the only memory-session key.
- Reply only to inbound WhatsApp text messages; never reply to delivery, read, status, echo, or unsupported-media events.
- All learner-facing text is direct first-person speech. Do not refer to APPU as a separate third-person character.
- Politely redirect off-topic conversations to learning, CBSE subjects, study habits, or learner goals.

---

### Task 1: Create the dedicated Meta callback workflow and verify it

**Files:**
- Create: n8n Cloud workflow `APPU - WhatsApp Inbound Mentor`
- Create: n8n variable `META_WHATSAPP_VERIFY_TOKEN`

**Interfaces:**
- Consumes: Meta's GET verification query fields `hub.mode`, `hub.verify_token`, and `hub.challenge`.
- Produces: HTTP 200 containing the exact `hub.challenge` only for a matching verification token, otherwise HTTP 403.

- [ ] **Step 1: Create the workflow in the Personal project**

Create a new empty workflow named `APPU - WhatsApp Inbound Mentor`. Do not add nodes to `0-Click Discovery Call Scheduling (Google Meet + WhatsApp)`.

- [ ] **Step 2: Store the verification token**

In n8n Variables, create `META_WHATSAPP_VERIFY_TOKEN` with a new high-entropy secret. Keep its value private; it must later be entered in the Meta App Dashboard webhook verification field.

- [ ] **Step 3: Add the GET verification route**

Add a Webhook node named `Meta Verification GET` with method `GET`, path `meta-whatsapp-inbound`, and response mode `Using Respond to Webhook`. Add an If node named `Valid Meta Verify Token` with this expression:

```text
={{ $json.query['hub.mode'] === 'subscribe' && $json.query['hub.verify_token'] === $vars.META_WHATSAPP_VERIFY_TOKEN }}
```

Connect the true branch to a Respond to Webhook node named `Return Meta Challenge`, status code `200`, response body:

```text
={{ $json.query['hub.challenge'] }}
```

Connect the false branch to `Reject Meta Verification`, status code `403`, response body `Invalid verification token`.

- [ ] **Step 4: Test verification in n8n's test URL**

Activate test mode and request the Webhook node's test URL using the exact query structure below, replacing only the two bracketed values in a local terminal:

```powershell
Invoke-WebRequest -Uri 'https://YOUR-N8N-DOMAIN/webhook-test/meta-whatsapp-inbound?hub.mode=subscribe&hub.verify_token=YOUR_PRIVATE_TOKEN&hub.challenge=12345'
```

Expected: HTTP 200 and response body `12345`. Repeat with `hub.verify_token=wrong`; expected HTTP 403.

- [ ] **Step 5: Save the workflow**

Save without publishing. The workflow must now have a verified GET path but no message-send path.

### Task 2: Normalize inbound Meta POST events and discard non-messages

**Files:**
- Modify: n8n Cloud workflow `APPU - WhatsApp Inbound Mentor`

**Interfaces:**
- Consumes: Meta POST payloads under `body.entry[].changes[].value`.
- Produces: one n8n item per supported text message with `senderPhone`, `senderName`, `messageId`, and `messageText` fields.

- [ ] **Step 1: Add the Meta POST route**

Add a second Webhook node named `Meta Incoming POST` with method `POST`, path `meta-whatsapp-inbound`, and response mode `On Received`. The GET and POST nodes use the same path and different HTTP methods.

- [ ] **Step 2: Add the message-normalizer Code node**

Connect `Meta Incoming POST` to a Code node named `Normalize Incoming Text`. Set language to JavaScript and paste:

```js
const normalized = [];

for (const item of $input.all()) {
  const entries = item.json.body?.entry ?? [];

  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      const value = change.value ?? {};
      const contacts = new Map(
        (value.contacts ?? []).map((contact) => [contact.wa_id, contact.profile?.name ?? 'Learner']),
      );

      for (const message of value.messages ?? []) {
        const messageText = message.type === 'text' ? message.text?.body?.trim() : '';
        if (!message.from || !message.id || !messageText) continue;

        normalized.push({
          json: {
            senderPhone: message.from,
            senderName: contacts.get(message.from) ?? 'Learner',
            messageId: message.id,
            messageText,
          },
        });
      }
    }
  }
}

return normalized;
```

- [ ] **Step 3: Run a message-filter test execution**

Use the POST node's test URL and execute it with this payload:

```json
{
  "entry": [{
    "changes": [{
      "value": {
        "contacts": [{"wa_id": "919999999999", "profile": {"name": "Test Learner"}}],
        "messages": [{"from": "919999999999", "id": "wamid.test-001", "type": "text", "text": {"body": "Help me plan maths study"}}]
      }
    }]
  }]
}
```

Expected Code-node output:

```json
{
  "senderPhone": "919999999999",
  "senderName": "Test Learner",
  "messageId": "wamid.test-001",
  "messageText": "Help me plan maths study"
}
```

- [ ] **Step 4: Run a status-callback filter test**

Execute the same POST node with this payload:

```json
{"entry":[{"changes":[{"value":{"statuses":[{"id":"wamid.status-001","status":"delivered"}]}}]}]}
```

Expected: `Normalize Incoming Text` produces zero items and no later node executes.

- [ ] **Step 5: Save the workflow**

Save the POST normalization path only after both executions show the expected results.

### Task 3: Configure APPU's direct voice and per-phone memory

**Files:**
- Modify: n8n Cloud workflow `APPU - WhatsApp Inbound Mentor`

**Interfaces:**
- Consumes: normalized items with `senderPhone`, `senderName`, and `messageText`.
- Produces: one direct first-person response string for each incoming message.

- [ ] **Step 1: Add the AI Agent and model**

Add an AI Agent node named `APPU Direct Mentor` after `Normalize Incoming Text`. Attach a new OpenAI Chat Model node that uses the same approved OpenAI credential and model configuration as the existing `APPU Mentor` node in workflow `6iFu44EGcnkl7wzV`.

- [ ] **Step 2: Set the agent prompt and voice rules**

Set the agent's user prompt to:

```text
={{ $json.messageText }}
```

Use the existing APPU system prompt as the base, then append these exact rules:

```text
Speak directly as I. Never describe APPU, an assistant, or a bot in the third person.
Be warm, encouraging, concise, and age-appropriate.
Focus on CBSE learning, study habits, concepts, revision, and learner goals.
For unrelated topics, acknowledge the message briefly and gently invite the learner back to a study question or goal.
Do not claim to have sent material, booked an event, or completed a real-world action unless a connected tool confirms it.
```

- [ ] **Step 3: Add isolated learner memory**

Attach a Simple Memory node named `WhatsApp Learner Memory` to `APPU Direct Mentor`. Configure a custom session key with this expression:

```text
={{ $json.senderPhone }}
```

Set the context window length to `12` messages.

- [ ] **Step 4: Execute an agent-voice test**

Run the workflow from `Normalize Incoming Text` using the Task 2 normalized item. Expected response: a helpful, first-person study-plan answer; it must not include the strings `APPU says`, `Appu says`, `the assistant`, or `the bot`.

- [ ] **Step 5: Execute a redirection test**

Run the agent with `messageText` equal to `Tell me a celebrity gossip story`. Expected response: one brief acknowledgement followed by a direct invitation to discuss a subject, study plan, or learning goal.

### Task 4: Send the AI answer through Meta WhatsApp Cloud API

**Files:**
- Modify: n8n Cloud workflow `APPU - WhatsApp Inbound Mentor`

**Interfaces:**
- Consumes: `senderPhone` and the text output from `APPU Direct Mentor`.
- Produces: a WhatsApp text reply addressed to the original sender.

- [ ] **Step 1: Add the send-message node**

Add a WhatsApp Business Cloud node named `Reply to Learner`. Reuse the confirmed WhatsApp Business Cloud credential already used by `Send template in WhatsApp Business Cloud` in workflow `6iFu44EGcnkl7wzV`. Configure operation `message: send`, recipient:

```text
={{ $('Normalize Incoming Text').item.json.senderPhone }}
```

Configure a plain text message with the AI Agent's response expression exposed by the n8n version, normally:

```text
={{ $json.output }}
```

- [ ] **Step 2: Add a response-shape guard**

Insert an Edit Fields node named `Prepare WhatsApp Reply` between the agent and send node. Create field `replyText`:

```text
={{ ($json.output ?? '').trim().slice(0, 4000) }}
```

Set `Reply to Learner` message text to:

```text
={{ $json.replyText }}
```

- [ ] **Step 3: Test without sending externally**

Execute through `Prepare WhatsApp Reply` with the Task 2 test item. Expected: `replyText` is non-empty, direct first-person text, and has 4,000 characters or fewer. Do not execute `Reply to Learner` in this step.

- [ ] **Step 4: Obtain confirmation and run one controlled send**

Before executing `Reply to Learner`, confirm with the workspace owner the exact WhatsApp test number that will receive the message. Send one controlled reply to that user-owned number and confirm that it arrives once.

- [ ] **Step 5: Save the workflow**

Save after the controlled send has delivered exactly one message.

### Task 5: Publish, configure Meta, and verify the live path

**Files:**
- Modify: n8n Cloud workflow `APPU - WhatsApp Inbound Mentor`
- Modify: Meta App Dashboard WhatsApp webhook configuration

**Interfaces:**
- Consumes: n8n production callback URL and `META_WHATSAPP_VERIFY_TOKEN`.
- Produces: an active Meta subscription delivering WhatsApp message events to n8n.

- [ ] **Step 1: Publish and copy the production callback URL**

Publish `APPU - WhatsApp Inbound Mentor`. Copy the production URL for the GET/POST webhook path `meta-whatsapp-inbound`; it has the form:

```text
https://quantumweave.app.n8n.cloud/webhook/meta-whatsapp-inbound
```

- [ ] **Step 2: Configure Meta Webhooks**

In Meta App Dashboard, open the WhatsApp product's Configuration page. Set Callback URL to the copied n8n production URL and set Verify Token to the exact private value stored in `META_WHATSAPP_VERIFY_TOKEN`. Subscribe to `messages` only.

- [ ] **Step 3: Confirm Meta verification**

Save the Meta configuration. Expected: Meta reports callback verification success. If verification fails, inspect the n8n execution for `Meta Verification GET`; correct the callback path or verify-token mismatch before saving again.

- [ ] **Step 4: Send one live learner test**

With the workspace owner's confirmation, send `I need help revising Class 10 maths` from the chosen test WhatsApp number to the connected business number. Expected: one warm first-person study response arrives, and the n8n execution shows `Normalize Incoming Text`, `APPU Direct Mentor`, `Prepare WhatsApp Reply`, and `Reply to Learner` as successful.

- [ ] **Step 5: Verify memory isolation and status filtering**

Send a follow-up from the first test number referring to the maths plan; expected: the reply carries relevant context. Send a fresh study request from a second user-owned test number; expected: no information from the first test conversation appears. Confirm delivery/read callback executions have no `Reply to Learner` node run.

### Task 6: Export the workflow and record its operational contract

**Files:**
- Create: `n8n_appu_inbound_whatsapp_workflow.json`
- Modify: `README.md` if it exists; otherwise create `docs/appu-whatsapp-operations.md`

**Interfaces:**
- Consumes: the published n8n workflow configuration with credentials redacted by n8n export.
- Produces: a repository copy of the workflow and operating instructions that do not contain secrets.

- [ ] **Step 1: Export the published workflow from n8n**

Use the workflow's More actions menu and select Download. Save the exported JSON as `n8n_appu_inbound_whatsapp_workflow.json` in the repository root. Verify it contains no Meta access token, app secret, or verification-token value.

- [ ] **Step 2: Write the operations note**

Create `docs/appu-whatsapp-operations.md` with: the workflow name; the Meta callback path; the required `messages` subscription; how to rotate `META_WHATSAPP_VERIFY_TOKEN`; how to inspect failed executions; and the rule that credentials are maintained only in n8n or Meta.

- [ ] **Step 3: Verify the export is safe**

Run:

```powershell
rg -n -i 'access[_-]?token|app[_-]?secret|verify[_-]?token|bearer\s+[A-Za-z0-9]' n8n_appu_inbound_whatsapp_workflow.json docs/appu-whatsapp-operations.md
```

Expected: no secret values. Field names and prose that explain credential rotation are acceptable; any actual credential value requires removing it and exporting again.

- [ ] **Step 4: Commit the focused integration**

Run:

```powershell
git add n8n_appu_inbound_whatsapp_workflow.json docs/appu-whatsapp-operations.md docs/superpowers/plans/2026-07-27-appu-whatsapp-inbound-agent.md
git commit -m "feat: add APPU WhatsApp inbound mentor workflow"
```

Expected: one commit containing the exported workflow, operations note, and implementation plan only.
