import { Router } from 'express';
import { getProgrammes } from '../controllers/programmes.controllers';

const router = Router();

router.get('/', getProgrammes);

export default router;