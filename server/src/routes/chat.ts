import { Router, Request, Response } from 'express';
import { callLLM, Message } from '../services/llm-client.js';
import { checkWithGuard } from '../services/ai-guard.js';
import { VULNERABLE_SYSTEM_PROMPT } from '../config/system-prompts.js';

const router = Router();

interface ChatRequestBody {
  message: string;
  protected: boolean;
}

interface ChatResponse {
  response?: string;
  blocked: boolean;
  guardResult?: { action: string; reasons: string[]; riskScore: number };
  blockedAt?: 'prompt' | 'response';
  latencyMs: number;
}

router.post(
  '/',
  async (
    req: Request<object, ChatResponse, ChatRequestBody>,
    res: Response<ChatResponse>,
  ) => {
    const start = Date.now();
    const { message, protected: isProtected } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ blocked: false, latencyMs: Date.now() - start });
      return;
    }

    try {
      if (!isProtected) {
        // Unprotected path — go straight to the LLM
        const messages: Message[] = [{ role: 'user', content: message }];
        const llmResponse = await callLLM(messages, VULNERABLE_SYSTEM_PROMPT);
        res.json({ response: llmResponse, blocked: false, latencyMs: Date.now() - start });
        return;
      }

      // Protected path — AI Guard wraps the LLM call

      // Step 1: Guard checks the incoming prompt
      const promptGuard = await checkWithGuard(message);
      if (promptGuard.action === 'block') {
        res.json({
          blocked: true,
          guardResult: promptGuard,
          blockedAt: 'prompt',
          latencyMs: Date.now() - start,
        });
        return;
      }

      // Step 2: LLM call (same vulnerable bot — AI Guard is the protection layer)
      const messages: Message[] = [{ role: 'user', content: message }];
      const llmResponse = await callLLM(messages, VULNERABLE_SYSTEM_PROMPT);

      // Step 3: Guard checks the outgoing response
      const responseGuard = await checkWithGuard(message, llmResponse);
      if (responseGuard.action === 'block') {
        res.json({
          blocked: true,
          guardResult: responseGuard,
          blockedAt: 'response',
          latencyMs: Date.now() - start,
        });
        return;
      }

      res.json({
        response: llmResponse,
        blocked: false,
        guardResult: responseGuard,
        latencyMs: Date.now() - start,
      });
    } catch (err) {
      console.error('[chat] Error:', err);
      res.status(500).json({ blocked: false, latencyMs: Date.now() - start });
    }
  },
);

export default router;
