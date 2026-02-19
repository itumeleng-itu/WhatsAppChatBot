import { Router } from 'express';
import { getCurriculum } from '../controllers/curriculum.controllers';

const router = Router();

router.get('/:programmeId', getCurriculum);

export default router;