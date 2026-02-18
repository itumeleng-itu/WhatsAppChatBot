import vonage from "../lib/vonage";
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

    if (hour < 12) return 'Ohayo gozaimasu';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function formatApiData(items: any[]): string {
    return items
        .map(item => `• ${item.question || item.title || item.name}\n  ${item.answer || item.description || ''}`)
        .join('\n\n');
}

const sendMessage = async (to: string, text: string) => {
    await vonage.messages.send({
        to,
        from: process.env.VOYAGE_NUMBER || 'Codetribe bot🤖',
        channel: 'whatsapp',
        messageType: 'text',
        text
    });
};

const personaAgent = new PersonaAgent();

export const WhatsAppService = {

    async sendCodetribeMenu(to: string, username: string) {
        const greeting = getGreeting();
        try {
            const response = await vonage.messages.send({
                to: to,
                from: process.env.VOYAGE_NUMBER || 'Codetribe bot🤖',
                channel: 'whatsapp',
                messageType: 'custom',
                custom: {
                    type: 'interactive',
                    interactive: {
                        type: 'button',
                        header: {
                            type: 'text',
                            text: 'CourseFinder'
                        },
                        body: {
                            text: `${greeting} ${username}! I'm Sam. How can I help you today?`
                        },
                        footer: {
                            text: 'Select an option below'
                        },
                        action: {
                            buttons: [
                                {
                                    type: 'reply',
                                    reply: { id: 'faqs', title: 'FAQs' }
                                },
                                {
                                    type: 'reply',
                                    reply: { id: 'eligibility', title: 'Eligibility' }
                                },
                                {
                                    type: 'reply',
                                    reply: { id: 'application_process', title: 'Application Process' }
                                },
                                {
                                    type: 'reply',
                                    reply: { id: 'curriculum', title: 'Curriculum' }
                                },
                                {
                                    type: 'reply',
                                    reply: { id: 'schedules', title: 'Codetribe Schedules' }
                                },
                                {
                                    type: 'reply',
                                    reply: { id: 'policies', title: 'Codetribe Policies' }
                                },
                                {
                                    type: 'reply',
                                    reply: { id: 'locations', title: 'Codetribe Locations' }
                                },
                            ]
                        }
                    }
                }
            });
            console.log('Menu sent');
        } catch (err) {
            console.error('Error sending interactive menu:', err);
        }
    },

    async sendCodetribeFaqMenu(to: string) {
        try {
            const response = await vonage.messages.send({
                to: to,
                from: process.env.VOYAGE_NUMBER || 'Codetribe bot🤖',
                channel: 'whatsapp',
                messageType: 'custom',
                custom: {
                    type: 'interactive',
                    interactive: {
                        type: 'button',
                        header: {
                            type: 'text',
                            text: 'FAQ menu'
                        },
                        body: {
                            text: `These are Frequently Asked Questions from our visitors.`
                        },
                        footer: {
                            text: 'Select an option below'
                        },
                        action: {
                            buttons: [
                                {
                                    type: 'reply',
                                    reply: { id: 'codetribe', title: 'What is Codetribe?' }
                                },
                                {
                                    type: 'reply',
                                    reply: { id: 'requirements', title: 'Requirements' }
                                },
                                {
                                    type: 'reply',
                                    reply: { id: 'stipend', title: 'Stipend' }
                                },
                                {
                                    type: 'reply',
                                    reply: { id: 'personal', title: 'Ask a question' }
                                }
                            ]
                        }
                    }
                }
            });
            console.log('Menu sent');
        } catch (err) {
            console.error('Error sending interactive menu:', err);
        }
    },

    async sendTypeYourQuestion(to: string) {
        try {
            await vonage.messages.send({
                to: to,
                from: process.env.VOYAGE_NUMBER || 'Codetribe bot🤖',
                channel: 'whatsapp',
                messageType: 'text',
                text: 'Go ahead and type your question below, I\'ll do my best to help!'
            });
        } catch (err) {
            console.error('Error sending prompt:', err);
        }
    },

    async sendEligibilityInfo(to: string) {
        try {
            const data = await fetchEligibility();
            await sendMessage(to, `✅ *Eligibility*\n\n${formatApiData(data)}`);
        } catch (err) {
            console.error('Error sending eligibility:', err);
        }
    },
    async sendPoliciesInfo(to:string){
        try {
            const data = await fetchPolicies();
            await sendMessage(to, `⚖️ *Policies*\n\n${formatApiData(data)}`);
        }
        catch(err){
            console.error(`Error sending policies:`,err)
        }
    },

    async sendFaqInfo(to:string) {
        try{
            const data = await fetchFaqs();
            await sendMessage(to, `❔ *FAQs*\n\n${formatApiData(data)}`)
        }catch(err){
            console.error('Error sending Faqs', err)
        }
    },

    async sendApplicationInfo(to:string){
        try{
            const data = await fetchApplicationProcess();
            await sendMessage(to, `📃 *Application Process*\n\n${formatApiData(data)}`)
        }
        catch(err){
            console.error('Error sending application information', err)
        }
        
    },

    async sendCurriculumInformation(to:string) {
        try{
            const data = await fetchCurriculum();
            await sendMessage(to, `📚 *Curriculum*\n\n${formatApiData(data)}`)
        }
        catch(err){
            console.error('Error sending curriculum information', err)
        }
    },

    async sendScheduleInformation(to:string) {
        try{
            const data = await fetchSchedule();
            await sendMessage(to, `🗓️ *Schedule*\n\n${formatApiData(data)}`)
        }catch(err){
            console.error('Error sending schedule information', err)
        }
    },

    async sendLocations(to:string){
        try{
            const data = await fetchLocations();
            await sendMessage(to, `🌍 *Locations*\n\n${formatApiData(data)}`);
        }
        catch(err){
            console.error('Error sending locations', err)
        }
    },
    
    async sendPersonalisedResponse(to: string, userQuestion: string) {
        try {
            await sendMessage(to, '⏳ Let me look that up for you...');
            const { message, confidence } = await personaAgent.processQuery(to, userQuestion);
            // low confidence = Sam isn't sure, signal it to the user
            const prefix = confidence < 0.4 ? '🤔 *Sam is not 100% sure:*' : '🤖 *Sam says:*';
            await sendMessage(to, `${prefix}\n\n${message}`);
        } 
        catch (err) {
            console.error('Error sending personalised response:', err);
            await sendMessage(to, '😔 Sorry, I ran into an issue. Please try again later.');
        }
    },
}