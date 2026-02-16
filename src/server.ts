import express from 'express';
import programmesRouter from './routes/programmes.routes'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//? API endpoint for getting programes
app.use('/api/programmes', programmesRouter);

//? 

//? 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
