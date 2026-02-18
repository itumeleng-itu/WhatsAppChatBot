import { Router } from 'express';
import { getEligibility } from '../controllers/eligility.controllers';

const router = Router();

router.get('/:programmeId', getEligibility);

export default router;