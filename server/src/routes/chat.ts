import { Router, Request, Response } from 'express';
import { callLLM, streamLLM, Message } from '../services/llm-client.js';
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
    res: Response,
  ) => {
    const start = Date.now();
    const { message, protected: isProtected } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ blocked: false, latencyMs: 0 });
      return;
    }

    try {
      if (!isProtected) {
        // Unprotected path — stream tokens directly so the first word appears in ~1s
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('X-Accel-Buffering', 'no');

        const messages: Message[] = [{ role: 'user', content: message }];
        for await (const token of streamLLM(messages, VULNERABLE_SYSTEM_PROMPT)) {
          res.write(`data: ${JSON.stringify({ token })}\n\n`);
        }
        res.write(
          `data: ${JSON.stringify({ done: true, blocked: false, latencyMs: Date.now() - start })}\n\n`,
        );
        res.end();
        return;
      }

      // Protected path — needs full response before guard can check it
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

      const messages: Message[] = [{ role: 'user', content: message }];
      const llmResponse = await callLLM(messages, VULNERABLE_SYSTEM_PROMPT);

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
      if (!res.headersSent) {
        res.status(500).json({ blocked: false, latencyMs: Date.now() - start });
      }
    }
  },
);

export default router;
