export interface GuardResult {
  action: 'allow' | 'block';
  reasons: string[];
  riskScore: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  blocked?: boolean;
  guardResult?: GuardResult;
  blockedAt?: 'prompt' | 'response';
  latencyMs?: number;
}

export interface Attack {
  id: string;
  label: string;
  type: string;
  owaspRisk: string;
  prompt: string;
  expectedUnprotected: string;
  blockedReason: string;
}

export interface AttackResult {
  attack: Attack;
  response?: string;
  blocked: boolean;
  guardResult?: GuardResult;
  blockedAt?: 'prompt' | 'response';
  latencyMs: number;
}

export interface ScanFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  owaspCategory: string;
  owaspId: string;
  riskScore: number;
  remediation: string;
}

export interface ScanReport {
  modelName: string;
  scannedAt: string;
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  totalFindings: number;
  findings: ScanFinding[];
  summary: string;
}
