import { Router } from 'express';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const router = Router();

const CONFIG_PATH = process.env.CONFIG_PATH ?? '/app/config/keys.json';

interface KeyConfig {
  V1_API_KEY?: string;
  TMAS_API_KEY?: string;
  V1_REGION?: string;
}

function readConfig(): KeyConfig {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) as KeyConfig;
  } catch {
    return {};
  }
}

function writeConfig(config: KeyConfig): void {
  mkdirSync(dirname(CONFIG_PATH), { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

function maskKey(key: string | undefined): string | null {
  if (!key) return null;
  if (key.length <= 8) return '****';
  return `${key.slice(0, 6)}****${key.slice(-4)}`;
}

// GET /api/config — returns masked status of current keys
router.get('/', (_req, res) => {
  res.json({
    v1ApiKeySet: Boolean(process.env.V1_API_KEY),
    tmasApiKeySet: Boolean(process.env.TMAS_API_KEY),
    v1ApiKeyMasked: maskKey(process.env.V1_API_KEY),
    tmasApiKeyMasked: maskKey(process.env.TMAS_API_KEY),
    v1Region: process.env.V1_REGION ?? 'us-1',
  });
});

// POST /api/config — apply keys immediately and persist to file
router.post('/', (req, res) => {
  const { v1ApiKey, tmasApiKey, v1Region } = req.body as {
    v1ApiKey?: string;
    tmasApiKey?: string;
    v1Region?: string;
  };

  const saved = readConfig();

  if (typeof v1ApiKey === 'string' && v1ApiKey.trim()) {
    process.env.V1_API_KEY = v1ApiKey.trim();
    saved.V1_API_KEY = v1ApiKey.trim();
  }

  if (typeof tmasApiKey === 'string' && tmasApiKey.trim()) {
    process.env.TMAS_API_KEY = tmasApiKey.trim();
    saved.TMAS_API_KEY = tmasApiKey.trim();
  }

  if (typeof v1Region === 'string' && v1Region.trim()) {
    process.env.V1_REGION = v1Region.trim();
    saved.V1_REGION = v1Region.trim();
  }

  try {
    writeConfig(saved);
  } catch (err) {
    console.error('[config] Failed to persist config:', err);
    // Still return success — keys are live in process.env even if file write failed
  }

  res.json({
    ok: true,
    v1ApiKeySet: Boolean(process.env.V1_API_KEY),
    tmasApiKeySet: Boolean(process.env.TMAS_API_KEY),
    v1Region: process.env.V1_REGION ?? 'us-1',
  });
});

export { readConfig };
export default router;
