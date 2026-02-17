import express from 'express';
import programmesRouter from './routes/programmes.routes';
import faqsRouter from './routes/faq.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//? API endpoint for programmes
app.use('/api/programmes', programmesRouter);

//? API endpoint for FAQs
app.use('/api/faqs', faqsRouter);

//? API endpoint for Eligibility
app.use('/api/eligility/[programmesId]')

//* 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
