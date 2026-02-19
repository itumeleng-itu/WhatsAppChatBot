import { Router } from 'express';
import { getApplicationSteps } from '../controllers/application.controllers';

const router = Router();

router.get('/:programmeId', getApplicationSteps);

export default router;