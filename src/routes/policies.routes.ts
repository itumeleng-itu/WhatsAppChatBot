import { Router } from 'express';
import { getPolicies } from '../controllers/policies.controllers';

const router = Router();

router.get('/', getPolicies);

export default router;