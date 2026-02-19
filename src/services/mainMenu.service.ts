import { VonageService } from './vonage.service';
import { OllamaService } from './ollama.service';
import {
    fetchEligibility,
    fetchApplicationProcess,
    fetchCurriculum,
    fetchSchedule,
    fetchPolicies,
    fetchLocations,
    fetchFaqs
} from './faq.services';
import { PersonaAgent } from '../agents/persona';


function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning ☀️';
    if (hour < 17) return 'Good afternoon 🌤️';
    return 'Good evening 🌙';
}

const vonageService = new VonageService();
const personaAgent = new PersonaAgent();

const sendMessage = async (to: string, text: string) => {
    await vonageService.sendMessage(to, text);
};

/**
 * Sends a navigation menu (Main Menu / End Session) after each answer.
 */
async function sendNavigationMenu(to: string) {
    try {
        await vonageService.sendCustomMessage(to, {
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: 'What would you like to do next? 😊'
                },
                action: {
                    buttons: [
                        { type: 'reply', reply: { id: 'main_menu', title: '🏠 Main Menu' } },
                        { type: 'reply', reply: { id: 'end_session', title: '👋 End Session' } }
                    ]
                }
            }
        });
    } catch (err) {
        console.error('Error sending navigation menu:', err);
    }
}

/**
 * Helper to send a list-type sub-menu.
 */
async function sendSubMenu(
    to: string,
    header: string,
    body: string,
    buttonLabel: string,
    sectionTitle: string,
    rows: { id: string; title: string; description: string }[]
) {
    try {
        await vonageService.sendCustomMessage(to, {
            type: 'interactive',
            interactive: {
                type: 'list',
                header: { type: 'text', text: header },
                body: { text: body },
                footer: { text: 'Tap below to choose ⬇️' },
                action: {
                    button: buttonLabel,
                    sections: [
                        {
                            title: sectionTitle,
                            rows: [
                                ...rows,
                                { id: 'personal', title: '✍️ Ask Own Question', description: 'Type your own question' },
                                { id: 'main_menu', title: '🏠 Main Menu', description: 'Go back to main menu' }
                            ]
                        }
                    ]
                }
            }
        });
    } catch (err) {
        console.error(`Error sending ${header} sub-menu:`, err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported WhatsAppService
// ─────────────────────────────────────────────────────────────────────────────

export const WhatsAppService = {

    // ── Main Menu ────────────────────────────────────────────────────────────

    async sendCodetribeMenu(to: string, username: string) {
        const greeting = getGreeting();
        try {
            await vonageService.sendCustomMessage(to, {
                type: 'interactive',
                interactive: {
                    type: 'list',
                    header: { type: 'text', text: '🤖 CodeTribe Chatbot' },
                    body: {
                        text: `${greeting} ${username}! I'm Sam, your friendly CodeTribe assistant. How can I help you today?`
                    },
                    footer: { text: 'Select an option below ⬇️' },
                    action: {
                        button: '📋 Main Menu',
                        sections: [
                            {
                                title: 'Explore',
                                rows: [
                                    { id: 'faqs', title: '❔ FAQs', description: 'Popular questions answered' },
                                    { id: 'eligibility', title: '✅ Eligibility', description: 'Check if you qualify' },
                                    { id: 'application_process', title: '📝 Application', description: 'How to apply' },
                                    { id: 'curriculum', title: '📚 Curriculum', description: 'What you will learn' },
                                    { id: 'schedules', title: '🗓️ Schedules', description: 'Dates & times' },
                                    { id: 'policies', title: '⚖️ Policies', description: 'Rules & guidelines' },
                                    { id: 'locations', title: '📍 Locations', description: 'Our campuses' }
                                ]
                            }
                        ]
                    }
                }
            });
        } catch (err) {
            console.error('Error sending main menu:', err);
        }
    },

    // ── Sub-Menus (List Messages) ────────────────────────────────────────────

    async sendFaqSubMenu(to: string) {
        await sendSubMenu(to,
            '❔ FAQs',
            'Here are some popular questions people ask! 🤓 Pick one or ask your own.',
            'View FAQs',
            'Popular Questions',
            [
                { id: 'faq_codetribe', title: 'What is CodeTribe?', description: 'Overview of the programme' },
                { id: 'faq_stipend', title: 'How much is the stipend?', description: 'Financial support details' },
                { id: 'faq_expenditure', title: 'Overall expenditure?', description: 'Total programme cost' },
            ]
        );
    },

    async sendEligibilitySubMenu(to: string) {
        await sendSubMenu(to,
            '✅ Eligibility',
            'Wondering if you qualify? Here are the key requirements 🎯',
            'View Requirements',
            'Eligibility Criteria',
            [
                { id: 'elig_age', title: 'Age Requirements', description: 'How old do I need to be?' },
                { id: 'elig_citizenship', title: 'Citizenship & ID', description: 'Do I need to be a SA citizen?' },
                { id: 'elig_qualification', title: 'Education Needed', description: 'What qualifications do I need?' },
            ]
        );
    },

    async sendApplicationSubMenu(to: string) {
        await sendSubMenu(to,
            '📝 Application Process',
            'Ready to apply? Here\'s what you need to know! 🚀',
            'View Steps',
            'Application Steps',
            [
                { id: 'app_online', title: 'Online Application', description: 'How to submit your application' },
                { id: 'app_documents', title: 'Required Documents', description: 'What to prepare' },
                { id: 'app_selection', title: 'Selection Process', description: 'What happens after you apply' },
            ]
        );
    },

    async sendCurriculumSubMenu(to: string) {
        await sendSubMenu(to,
            '📚 Curriculum',
            'Curious about what you\'ll learn? Check out the modules 💡',
            'View Modules',
            'Training Modules',
            [
                { id: 'curr_web', title: 'Web Development', description: 'Front-end & back-end skills' },
                { id: 'curr_mobile', title: 'Mobile Development', description: 'Build mobile apps' },
                { id: 'curr_it', title: 'IT Support', description: 'Technical support skills' },
            ]
        );
    },

    async sendScheduleSubMenu(to: string) {
        await sendSubMenu(to,
            '🗓️ Schedules',
            'Here are the key dates and times to know about ⏰',
            'View Schedule',
            'Schedule Info',
            [
                { id: 'sched_bootcamp', title: 'Bootcamp', description: 'Intensive training period' },
                { id: 'sched_hours', title: 'Training Hours', description: 'Daily schedule' },
                { id: 'sched_graduation', title: 'Graduation', description: 'Ceremony details' },
            ]
        );
    },

    async sendPoliciesSubMenu(to: string) {
        await sendSubMenu(to,
            '⚖️ Policies',
            'Important rules and guidelines to be aware of 📋',
            'View Policies',
            'Key Policies',
            [
                { id: 'pol_attendance', title: 'Attendance Policy', description: 'Attendance expectations' },
                { id: 'pol_conduct', title: 'Code of Conduct', description: 'Behaviour guidelines' },
                { id: 'pol_equipment', title: 'Equipment Policy', description: 'Device & equipment rules' },
            ]
        );
    },

    async sendLocationsSubMenu(to: string) {
        await sendSubMenu(to,
            '📍 Locations',
            'Find a CodeTribe campus near you! 🌍',
            'View Locations',
            'Our Campuses',
            [
                { id: 'loc_tshwane', title: 'Tshwane', description: 'Pretoria campus' },
                { id: 'loc_soweto', title: 'Soweto', description: 'Soweto campus' },
                { id: 'loc_limpopo', title: 'Limpopo', description: 'Limpopo campus' },
            ]
        );
    },

    // ── Prompt user to type own question ─────────────────────────────────────

    async sendTypeYourQuestion(to: string) {
        try {
            await vonageService.sendMessage(to, '✍️ Go ahead and type your question below — I\'ll do my best to help! 😊');
        } catch (err) {
            console.error('Error sending prompt:', err);
        }
    },

    // ── Detailed answer for a specific sub-menu item ─────────────────────────
    // Sends exactly ONE "cooking" message, then ONE answer + nav menu.

    async sendDetailedAnswer(to: string, query: string) {
        try {
            // 1. Single "cooking" notification
            await sendMessage(to, '⏳ Let me cook that up for you...');

            // 2. Fetch & generate answer (single API + Ollama call)
            const { message, confidence } = await personaAgent.processQuery(to, query);

            // 3. Send the answer + nav menu
            const prefix = confidence < 0.4 ? '🤔' : '🤖';
            await sendMessage(to, `${prefix} ${message}`);
            await sendNavigationMenu(to);
        } catch (err) {
            console.error('Error sending detailed answer:', err);
            await sendMessage(to, '😔 Sorry, I hit a snag. Try again or pick a different option!');
            await sendNavigationMenu(to);
        }
    },

    // ── Personalised response (free-text questions) ──────────────────────────
    // Same pattern: ONE "cooking" msg → ONE answer → nav menu

    async sendPersonalisedResponse(to: string, userQuestion: string) {
        try {
            await sendMessage(to, '⏳ Let me cook that up for you...');
            const { message, confidence } = await personaAgent.processQuery(to, userQuestion);
            const prefix = confidence < 0.4 ? '🤔' : '🤖';
            await sendMessage(to, `${prefix} ${message}`);
            await sendNavigationMenu(to);
        }
        catch (err) {
            console.error('Error sending personalised response:', err);
            await sendMessage(to, '😔 Sorry, I hit a snag. Try again later!');
        }
    },
}