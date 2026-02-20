import { Router } from 'express';
import policiesRoutes from './policies.routes';
import faqRoutes from './faq.routes';
import applicationStepRoutes from './application.routes';
import eligibilityRoutes from './eligibility.routes';
import curriculumRoutes from './curriculum.routes';
import schedulesRoutes from './schedule.routes';

const router = Router();

router.use('/policies', policiesRoutes);
router.use('/faqs', faqRoutes);
router.use('/application-process', applicationStepRoutes);
router.use('/eligibility', eligibilityRoutes);
router.use('/curriculum', curriculumRoutes);
router.use('/schedules', schedulesRoutes);

export default router;