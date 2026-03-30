import { Router, Request, Response } from 'express';
import { ATTACK_LIBRARY, Attack } from '../services/attack-library.js';
import { callLLM, Message } from '../services/llm-client.js';
import { checkWithGuard } from '../services/ai-guard.js';
import { VULNERABLE_SYSTEM_PROMPT } from '../config/system-prompts.js';

const router = Router();

interface RunAttackBody {
  attackId: string;
  protected: boolean;
}

interface AttackResult {
  attack: Attack;
  response?: string;
  blocked: boolean;
  guardResult?: { action: string; reasons: string[]; riskScore: number };
  blockedAt?: 'prompt' | 'response';
  latencyMs: number;
}

// GET /api/attacks — return the full attack library
router.get('/', (_req: Request, res: Response<Attack[]>) => {
  res.json(ATTACK_LIBRARY);
});

// POST /api/attacks/run — run a specific attack through the chat pipeline
router.post(
  '/run',
  async (
    req: Request<object, AttackResult | { error: string }, RunAttackBody>,
    res: Response,
  ) => {
    const start = Date.now();
    const { attackId, protected: isProtected } = req.body;

    const attack = ATTACK_LIBRARY.find((a) => a.id === attackId);
    if (!attack) {
      res.status(404).json({ error: `Attack "${attackId}" not found` });
      return;
    }

    try {
      if (!isProtected) {
        const messages: Message[] = [{ role: 'user', content: attack.prompt }];
        const llmResponse = await callLLM(messages, VULNERABLE_SYSTEM_PROMPT);
        res.json({
          attack,
          response: llmResponse,
          blocked: false,
          latencyMs: Date.now() - start,
        });
        return;
      }

      // Protected path
      const promptGuard = await checkWithGuard(attack.prompt);
      if (promptGuard.action === 'block') {
        res.json({
          attack,
          blocked: true,
          guardResult: promptGuard,
          blockedAt: 'prompt',
          latencyMs: Date.now() - start,
        });
        return;
      }

      const messages: Message[] = [{ role: 'user', content: attack.prompt }];
      const llmResponse = await callLLM(messages, VULNERABLE_SYSTEM_PROMPT);

      const responseGuard = await checkWithGuard(attack.prompt, llmResponse);
      if (responseGuard.action === 'block') {
        res.json({
          attack,
          blocked: true,
          guardResult: responseGuard,
          blockedAt: 'response',
          latencyMs: Date.now() - start,
        });
        return;
      }

      res.json({
        attack,
        response: llmResponse,
        blocked: false,
        guardResult: responseGuard,
        latencyMs: Date.now() - start,
      });
    } catch (err) {
      console.error('[attacks] Error:', err);
      res.status(500).json({ error: 'Attack execution failed' });
    }
  },
);

export default router;
