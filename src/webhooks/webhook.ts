import express, { Request, Response } from 'express';
import { WhatsAppService } from '../services/mainMenu.service';
import { OllamaService } from '../services/ollama.service';
import { VonageService } from '../services/vonage.service';

const router = express.Router();
const ollamaService = new OllamaService();
const vonageService = new VonageService();

// ── Mapping: sub-menu item IDs → natural language queries for Ollama ────────
const detailQueries: Record<string, string> = {
    // FAQs
    'faq_codetribe': 'What is CodeTribe Academy? Give a friendly overview.',
    'faq_stipend': 'How much is the CodeTribe stipend and how does financial support work?',
    'faq_expenditure': 'What is the overall expenditure or cost for CodeTribe Academy?',

    // Eligibility
    'elig_age': 'What are the age requirements to join CodeTribe Academy?',
    'elig_citizenship': 'Do I need to be a South African citizen to join CodeTribe? What ID do I need?',
    'elig_qualification': 'What education or qualifications do I need to join CodeTribe Academy?',

    // Application Process
    'app_online': 'How do I submit an online application for CodeTribe Academy?',
    'app_documents': 'What documents do I need to apply for CodeTribe Academy?',
    'app_selection': 'What is the selection process after I apply to CodeTribe Academy?',

    // Curriculum
    'curr_web': 'What does the web development curriculum at CodeTribe cover?',
    'curr_mobile': 'What does the mobile development curriculum at CodeTribe cover?',
    'curr_it': 'What does the IT support curriculum at CodeTribe cover?',

    // Schedules
    'sched_bootcamp': 'Tell me about the CodeTribe bootcamp schedule — when does it start and how long is it?',
    'sched_hours': 'What are the regular training hours at CodeTribe Academy?',
    'sched_graduation': 'When is the CodeTribe graduation ceremony?',

    // Policies
    'pol_attendance': 'What is the attendance policy at CodeTribe Academy?',
    'pol_conduct': 'What is the code of conduct at CodeTribe Academy?',
    'pol_equipment': 'What is the equipment and device policy at CodeTribe Academy?',

    // Locations
    'loc_tshwane': 'Tell me about the CodeTribe Tshwane / Pretoria campus — address and details.',
    'loc_soweto': 'Tell me about the CodeTribe Soweto campus — address and details.',
    'loc_limpopo': 'Tell me about the CodeTribe Limpopo campus — address and details.',
};

// ── Bot number + deduplication ──────────────────────────────────────────────
const BOT_NUMBER = process.env.VONAGE_WHATSAPP_NUMBER || '14157386102';

// Track recently processed message UUIDs to prevent duplicate handling.
// Vonage may send the same webhook multiple times (retries, context updates).
const processedMessages = new Set<string>();
const MAX_PROCESSED = 200;

function markProcessed(uuid: string): boolean {
    if (processedMessages.has(uuid)) return false; // already handled
    processedMessages.add(uuid);
    // Prevent the Set from growing unbounded
    if (processedMessages.size > MAX_PROCESSED) {
        const first = processedMessages.values().next().value;
        if (first) processedMessages.delete(first);
    }
    return true; // first time seeing this UUID
}

// Handle inbound messages
router.post('/webhook', async (req: Request, res: Response) => {
    // Always respond 200 immediately so Vonage doesn't retry
    res.status(200).send('OK');

    try {
        const body = req.body;

        // ── 1. Ignore delivery status callbacks ──────────────────────────
        if (body.status) {
            return;
        }

        // ── 2. Ignore echoes from the bot's own number ───────────────────
        const incomingFrom = body.from || body.message?.from || '';
        if (incomingFrom === BOT_NUMBER) {
            return;
        }

        // ── 3. Require actual user content ───────────────────────────────
        const hasText = !!body.text || !!body.message?.content?.text;
        const hasReply = body.message_type === 'reply' && !!body.reply;
        const hasInteractive = body.message_type === 'interactive' && !!body.interactive;
        const hasNestedInteractive = body.message?.content?.type === 'interactive';

        if (!hasText && !hasReply && !hasInteractive && !hasNestedInteractive) {
            return;
        }

        // ── 4. Deduplicate: skip if we already handled this message_uuid ─
        const msgUuid = body.message_uuid || '';
        if (msgUuid && !markProcessed(msgUuid)) {
            console.log('[Webhook] Duplicate message_uuid, skipping:', msgUuid);
            return;
        }

        const parsedMessage = vonageService.parseIncomingMessage(body);
        if (!parsedMessage) {
            return;
        }

        const { from: sender, message: text } = parsedMessage;

        // ── Extract button ID ────────────────────────────────────────────
        let buttonId = '';
        if (body.message?.content?.type === 'interactive') {
            buttonId = body.message.content.interactive?.list_reply?.id ||
                body.message.content.interactive?.button_reply?.id ||
                body.message.content.interactive?.payload;
        } else if (body.message_type === 'interactive' && body.interactive) {
            buttonId = body.interactive.button_reply?.id || body.interactive.list_reply?.id;
        } else if (body.message_type === 'reply' && body.reply) {
            buttonId = body.reply.id;
        }

        console.log('[Webhook] sender:', sender, '| text:', text, '| buttonId:', buttonId);

        // ── Handle free-text messages ────────────────────────────────────
        if (text && !buttonId) {
            const greetings = ['hi', 'hello', 'hey', 'start', 'menu', 'hola', 'codetribe', 'join', 'yo', 'morning', 'afternoon', 'evening', 'sam', 'intro'];
            if (greetings.includes(text.toLowerCase().trim())) {
                await WhatsAppService.sendCodetribeMenu(sender, 'there');
            } else {
                await WhatsAppService.sendPersonalisedResponse(sender, text);
            }
            return;
        }

        // ── Handle button / list-reply interactions ──────────────────────
        if (buttonId) {
            console.log('[Webhook] Processing button:', buttonId);

            // Sub-menu detail item → humanized answer
            if (detailQueries[buttonId]) {
                await WhatsAppService.sendDetailedAnswer(sender, detailQueries[buttonId]);
                return;
            }

            // Main menu category → open sub-menu
            switch (buttonId) {
                case 'faqs': await WhatsAppService.sendFaqSubMenu(sender); break;
                case 'eligibility': await WhatsAppService.sendEligibilitySubMenu(sender); break;
                case 'application_process': await WhatsAppService.sendApplicationSubMenu(sender); break;
                case 'curriculum': await WhatsAppService.sendCurriculumSubMenu(sender); break;
                case 'schedules': await WhatsAppService.sendScheduleSubMenu(sender); break;
                case 'policies': await WhatsAppService.sendPoliciesSubMenu(sender); break;
                case 'locations': await WhatsAppService.sendLocationsSubMenu(sender); break;

                case 'main_menu': await WhatsAppService.sendCodetribeMenu(sender, 'there'); break;
                case 'end_session': await vonageService.sendMessage(sender, 'Thanks for chatting with me! Have an awesome day! 🙌👋'); break;
                case 'personal': await WhatsAppService.sendTypeYourQuestion(sender); break;

                default:
                    console.log('[Webhook] Unknown button:', buttonId);
                    await WhatsAppService.sendCodetribeMenu(sender, 'there');
                    break;
            }
        }
    } catch (error) {
        console.error('[Webhook] Error:', error);
    }
});

export default router;