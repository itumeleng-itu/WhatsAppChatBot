import express, { Request, Response } from 'express';
import { WhatsAppService } from '../services/mainMenu.service';


const router = express.Router()

router.post('/inbound', async(req: Request, res: Response)=>{

    const {from, profile, message_type, text, button} = req.body;

    const username = profile?.name || 'there'

    try{
        if(message_type === 'text') {

            

        }
        else if(message_type === button){
            const buttonId = button?.payload;

            switch (buttonId){
                case 'faqs':
                    await WhatsAppService.sendCodetribeFaqMenu(from)
                    break;

                case 'personal':
                    await WhatsAppService.sendTypeYourQuestion(from)
                    break;

                
                    
            }
        }
    }catch(error){
        throw new Error
    }
    })