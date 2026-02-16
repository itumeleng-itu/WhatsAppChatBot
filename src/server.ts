import express from 'express';
import 'dotenv/config';
import { log } from 'node:console';

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, (): void => {
  console.log(` Server running on  https://localhost:${PORT}`);
});