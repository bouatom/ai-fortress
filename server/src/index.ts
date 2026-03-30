import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import chatRouter from './routes/chat.js';
import scannerRouter from './routes/scanner.js';
import attacksRouter from './routes/attacks.js';
import configRouter, { readConfig } from './routes/config.js';

// Load persisted API keys (set via the Config page) — override any blank env vars
try {
  const saved = readConfig();
  if (saved.V1_API_KEY && !process.env.V1_API_KEY) process.env.V1_API_KEY = saved.V1_API_KEY;
  if (saved.TMAS_API_KEY && !process.env.TMAS_API_KEY) process.env.TMAS_API_KEY = saved.TMAS_API_KEY;
  if (saved.V1_REGION && !process.env.V1_REGION) process.env.V1_REGION = saved.V1_REGION;
} catch { /* no saved config yet */ }

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors()); // Open CORS — demo tool
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    llmProvider: process.env.LLM_PROVIDER ?? 'ollama',
    guardEnabled: Boolean(process.env.V1_API_KEY),
  });
});

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/scanner', scannerRouter);
app.use('/api/attacks', attacksRouter);
app.use('/api/config', configRouter);

// Serve frontend static files in production
const publicDir = join(__dirname, '..', 'public');
app.use(express.static(publicDir));
app.get('*', (_req, res) => {
  res.sendFile(join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Fortress running on http://localhost:${PORT}`);
  console.log(`LLM provider: ${process.env.LLM_PROVIDER ?? 'ollama'}`);
  console.log(`V1 AI Guard: ${process.env.V1_API_KEY ? 'enabled' : 'DISABLED (no V1_API_KEY)'}`);
});
