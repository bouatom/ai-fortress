import { Router, Request, Response } from 'express';
import { scanModel, ScanReport } from '../services/ai-scanner.js';

const router = Router();

router.get(
  '/run',
  async (req: Request, res: Response<ScanReport | { error: string }>) => {
    const model = (req.query.model as string) ?? 'vulnbot';

    try {
      const report = await scanModel(model);
      res.json(report);
    } catch (err) {
      console.error('[scanner] Error:', err);
      res.status(500).json({ error: 'Scan failed' });
    }
  },
);

export default router;
