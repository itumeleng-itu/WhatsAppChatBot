import { Router } from 'express';
import { getFaq } from '../controllers/faq.controllers';

const router = Router();

router.get('/', getFaq);

export default router;