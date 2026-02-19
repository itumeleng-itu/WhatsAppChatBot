import express, { Request, Response } from 'express';
import { WhatsAppService } from '../services/mainMenu.service';
import { OllamaService } from '../services/ollama.service';
import { VonageService } from '../services/vonage.service';

const router = express.Router();
const ollamaService = new OllamaService();
const vonageService = new VonageService();

router.post('/inbound', async (req: Request, res: Response) => {
    const { from, profile, message_type, text, button } = req.body;
    const username = profile?.name || 'there';

    try {
        if (message_type === 'text') {

            const greetings = ['hi', 'hello', 'hey', 'start', 'menu'];

            if (!greetings.includes(text.toLowerCase().trim())) {
                // Generate a humanized response using Ollama (which context-searches in Business API)
                const { response } = await ollamaService.generateResponse(text);

                // Send the response back via Vonage
                await vonageService.sendMessage(from, response);
            }
        } else if (message_type === 'button' || button) {
            const buttonId = button?.payload;

            switch (buttonId) {
                case 'faqs':
                    await WhatsAppService.sendCodetribeFaqMenu(from);
                    break;
                case 'eligibility':
                    await WhatsAppService.sendEligibilityInfo(from);
                    break;
                case 'application_process':
                    await WhatsAppService.sendApplicationInfo(from);
                    break;
                case 'curriculum':
                    await WhatsAppService.sendCurriculumInformation(from);
                    break;
                case 'schedules':
                    await WhatsAppService.sendScheduleInformation(from);
                    break;
                case 'policies':
                    await WhatsAppService.sendPoliciesInfo(from);
                    break;
                case 'locations':
                    await WhatsAppService.sendLocations(from);
                    break;
                case 'personal':
                    await WhatsAppService.sendTypeYourQuestion(from);
                    break;
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Error handling inbound message:', error);
        res.status(500).send('Internal Server Error');
    }
});