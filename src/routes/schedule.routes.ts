import { Router } from 'express';
import { getSchedules } from '../controllers/schedule.controllers';

const router = Router();

router.get('/:programmeId', getSchedules);

export default router;