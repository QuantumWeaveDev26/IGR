# APPU WhatsApp Inbound Agent Design

## Goal

Reply automatically to every supported incoming WhatsApp text message with a natural, first-person APPU learning-mentor response. The inbound automation must be separate from the existing landing-page chat workflow.

## Scope

- Receive Meta WhatsApp Cloud API webhook verification and message events.
- Ignore delivery, read, status, and unsupported event payloads.
- Extract the sender phone number and text message from each incoming event.
- Route messages to the existing n8n APPU Mentor agent and its configured OpenAI model.
- Use the sender's WhatsApp number as the memory/session key so learner context remains isolated by person.
- Send the agent's text response through WhatsApp Cloud API using the existing WhatsApp messaging capability.
- Keep replies in first person. The prompt must never refer to APPU as a separate third-person character.
- Briefly acknowledge off-topic requests, then guide the learner back to studies, goals, or CBSE learning.

## Architecture

`Meta webhook -> event filter -> message normalizer -> APPU agent -> WhatsApp Cloud send-message -> execution logging`

The new inbound workflow owns only incoming WhatsApp conversations. The existing landing-page chat workflow, scheduled parent digest, calendar, and discovery-call paths remain unchanged.

## Meta Integration

- A GET endpoint handles Meta webhook verification using a secret verify token stored in n8n credentials or variables.
- A POST endpoint receives inbound WhatsApp events.
- Meta's production callback URL points to the activated n8n production webhook URL.
- The WhatsApp Cloud API credential is stored in n8n, never in source files or browser-chat messages.

## APPU Response Contract

- Input: `sender_phone`, incoming text, and learner memory for that phone.
- Output: a concise plain-text WhatsApp reply.
- Voice: warm, encouraging, age-appropriate, direct first person, and naturally conversational.
- Focus: academic support, CBSE learning, study planning, and learning confidence.
- Off-topic behavior: acknowledge politely, then invite the learner back to a learning question or goal.

## Failure Handling

- Ignore events that have no inbound text message or no sender number.
- Prevent duplicate replies by filtering non-message webhook payloads; preserve execution data for diagnosis.
- If the AI response or outbound message fails, record the failed execution in n8n and send no fabricated success response.
- The workflow will be tested with Meta's webhook verification request and a controlled WhatsApp text message before it is relied on for live learner conversations.

## Acceptance Criteria

1. Meta completes webhook verification against the n8n production URL.
2. A text sent to the connected WhatsApp number produces one reply.
3. The reply is in APPU's first-person mentor voice and does not narrate APPU in third person.
4. A second message from the same number uses that learner's conversation memory.
5. Messages from different numbers do not share memory.
6. Delivery/read-status callbacks do not produce replies.
