import express from 'express';
<<<<<<< HEAD
import 'dotenv/config';
import whatsappRoutes from './routes/whatsapp.routes';
import mlabRoutes from './routes/mlab.routes';
import { BusinessApiService } from './services/business-api.service';
=======
import programmesRouter from './routes/programmes.routes';
import faqsRouter from './routes/faq.routes';
import dotenv from 'dotenv';

dotenv.config();
>>>>>>> 3a63e684efa5989ffa65335b19a7f2fbe87ecb98

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//? API endpoint for programmes
app.use('/api/programmes', programmesRouter);

<<<<<<< HEAD
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
      mlabHealth: '/api/mlab/health',
      mlabTest: '/api/mlab/api/test',
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/**
 * Startup connectivity verification and cache pre-warming
 * Verifies Business API connection and pre-warms cache if enabled
 */
async function initializeApiService(): Promise<BusinessApiService> {
  const verifyOnStartup = process.env.API_VERIFY_ON_STARTUP === 'true';
  const preWarmCache = process.env.API_PREWARM_CACHE !== 'false'; // Default: true
  
  const businessApiService = new BusinessApiService();
  
  if (verifyOnStartup) {
    console.log('🔍 Verifying Business API connectivity on startup...');
    
    try {
      await businessApiService.verifyConnectionOnStartup();
    } catch (error: any) {
      console.error('❌ Business API connectivity verification failed:', error.message);
      console.error('⚠️  Server will start, but API calls may fail. Check your BUSINESS_API_URL and network connectivity.');
      // Don't throw - allow server to start even if API is unreachable
      // This prevents deployment issues if API is temporarily down
    }
  } else {
    console.log('ℹ️  API connectivity verification on startup is disabled (set API_VERIFY_ON_STARTUP=true to enable)');
  }

  // Pre-warm cache for faster initial responses
  if (preWarmCache) {
    console.log('🔥 Pre-warming cache for faster responses...');
    try {
      await businessApiService.preWarmCache();
      
      // Start background cache refresh
      businessApiService.startCacheRefreshInterval(parseInt(process.env.API_CACHE_REFRESH_INTERVAL_MS || '60000', 10));
    } catch (error: any) {
      console.warn('⚠️  Cache pre-warming failed:', error.message);
    }
  }

  return businessApiService;
}

// Start server with connectivity verification and cache pre-warming
async function startServer() {
  // Initialize API service (verify connectivity and pre-warm cache)
  await initializeApiService();
  
  app.listen(PORT, (): void => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Vonage WhatsApp webhook: http://localhost:${PORT}/api/whatsapp/webhook`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/whatsapp/chat`);
    console.log(`📊 Logs endpoint: http://localhost:${PORT}/api/mlab/logs`);
    console.log(`📊 Health check available at http://localhost:${PORT}/api/mlab/health`);
    console.log(`🔧 API test available at http://localhost:${PORT}/api/mlab/api/test`);
  });
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
=======
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
>>>>>>> 3a63e684efa5989ffa65335b19a7f2fbe87ecb98
});
