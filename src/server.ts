import express from 'express';
import 'dotenv/config';
import whatsappRoutes from './routes/whatsapp.routes';
import mlabRoutes from './routes/mlab.routes';

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/mlab', mlabRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CodeTribe Academy Learner Support WhatsApp Bot',
    version: '1.0.0',
    provider: 'Vonage API',
    endpoints: {
      health: '/api/whatsapp/health',
      chat: '/api/whatsapp/chat',
      webhook: '/api/whatsapp/webhook',
      categories: '/api/whatsapp/categories',
      logs: '/api/mlab/logs',
    },
  });
});

app.listen(PORT, (): void => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Vonage WhatsApp webhook: http://localhost:${PORT}/api/whatsapp/webhook`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/whatsapp/chat`);
  console.log(`📊 Logs endpoint: http://localhost:${PORT}/api/mlab/logs`);
});