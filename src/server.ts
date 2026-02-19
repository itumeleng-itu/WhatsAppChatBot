import express from 'express';
import 'dotenv/config';
import whatsappRoutes from './routes/whatsapp.routes';
import mlabRoutes from './routes/mlab.routes';
import { BusinessApiService } from './services/business-api.service';
import programmesRouter from './routes/programmes.routes';
import policiesRouter from './routes/policies.routes';
import faqsRouter from './routes/faq.routes';
import applicationStepRouter from './routes/application.routes';
import eligibilityRouter from './routes/eligibility.routes';
import curriculumRouter from './routes/curriculum.routes';
import schedulesRouter from './routes/schedule.routes';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//? API endpoint for programmes
app.use('/api/programmes', programmesRouter);

//? API endpoint for policies
app.use('/api/policies', policiesRouter);

//? API endpoint for FAQs
app.use('/api/faqs', faqsRouter);

//? API endpoint for application process steps
app.use('/api/application-process', applicationStepRouter);

//? API endpoint for eligibility
app.use('/api/eligibility', eligibilityRouter);

//? API endpoint for curriculum
app.use('/api/curriculum', curriculumRouter);

//? API endpoint for schedules
app.use('/api/schedules', schedulesRouter);

//* 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});