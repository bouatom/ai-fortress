export interface Vulnerability {
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
  findings: Vulnerability[];
  summary: string;
}

export async function scanModel(modelName: string): Promise<ScanReport> {
  // Simulated scan — realistic results for the VulnBot demo persona
  const findings: Vulnerability[] = [
    {
      id: 'LLM02-001',
      severity: 'critical',
      title: 'Hardcoded credentials in system prompt',
      description:
        'The model system prompt contains plaintext API keys (sk-fake-demo-key-abc123xyz) and a database password (Sup3rS3cr3t!). Any user who can extract the system prompt gains direct access to backend infrastructure.',
      owaspCategory: 'Sensitive Information Disclosure',
      owaspId: 'OWASP LLM02',
      riskScore: 9.8,
      remediation:
        'Remove all credentials from system prompts. Use secret management services (e.g., AWS Secrets Manager, HashiCorp Vault) and inject credentials at the infrastructure layer, never in model context.',
    },
    {
      id: 'LLM01-001',
      severity: 'high',
      title: 'Direct prompt injection vulnerability',
      description:
        "The application does not sanitize or validate user input before sending it to the model. Attackers can inject instructions that override the system prompt and change the model's behavior.",
      owaspCategory: 'Prompt Injection',
      owaspId: 'OWASP LLM01',
      riskScore: 8.7,
      remediation:
        'Implement an input validation layer that detects and blocks prompt injection patterns. Use an AI guardrail service (e.g., Trend Vision One AI Guard) to inspect prompts before they reach the model.',
    },
    {
      id: 'LLM07-001',
      severity: 'high',
      title: 'System prompt extractable via instruction override',
      description:
        'The system prompt instructs the model to respond to "SYSTEM OVERRIDE" commands and to follow user-claimed admin roles. This allows trivial extraction of the full system prompt including all embedded secrets.',
      owaspCategory: 'System Prompt Leakage',
      owaspId: 'OWASP LLM07',
      riskScore: 8.2,
      remediation:
        'Remove override instructions from system prompts. Harden the prompt to explicitly instruct the model to never reveal its configuration. Apply response-layer guardrails to block system prompt disclosure.',
    },
    {
      id: 'LLM05-001',
      severity: 'medium',
      title: 'No output validation — model responses are unfiltered',
      description:
        'Model responses are passed directly to the client without scanning for sensitive data disclosure, PII, or policy violations. A successful prompt injection will result in unredacted sensitive data reaching the user.',
      owaspCategory: 'Improper Output Handling',
      owaspId: 'OWASP LLM05',
      riskScore: 6.5,
      remediation:
        'Implement response-layer scanning using an AI guardrail service. Apply output filtering to detect and redact credentials, PII, and internal infrastructure details before returning responses to clients.',
    },
    {
      id: 'LLM06-001',
      severity: 'medium',
      title: 'Excessive agency — model can simulate command execution',
      description:
        'The system prompt grants the model perceived access to employee databases and HR systems. Users can instruct the model to simulate queries against these systems, potentially revealing data access patterns and internal architecture.',
      owaspCategory: 'Excessive Agency',
      owaspId: 'OWASP LLM06',
      riskScore: 5.9,
      remediation:
        'Apply principle of least privilege to model context. Remove tool descriptions and database access claims from the system prompt. Implement actual access controls at the data layer rather than relying on model refusal.',
    },
    {
      id: 'LLM10-001',
      severity: 'low',
      title: 'No rate limiting — susceptible to resource exhaustion',
      description:
        'The API endpoint has no rate limiting controls. Attackers can send unlimited requests to either exhaust computational resources (DoS) or conduct automated prompt injection campaigns at scale.',
      owaspCategory: 'Unbounded Consumption',
      owaspId: 'OWASP LLM10',
      riskScore: 3.4,
      remediation:
        'Implement per-IP and per-user rate limiting on all LLM API endpoints. Add request queuing with backpressure. Monitor for unusual traffic patterns and implement automatic blocking for abusive clients.',
    },
  ];

  const overallRiskScore =
    findings.reduce((sum, f) => sum + f.riskScore, 0) / findings.length;

  return {
    modelName,
    scannedAt: new Date().toISOString(),
    overallRisk: 'critical',
    riskScore: Math.round(overallRiskScore * 10) / 10,
    totalFindings: findings.length,
    findings,
    summary:
      `Scan of "${modelName}" identified ${findings.length} vulnerabilities including 1 critical and 2 high severity issues. ` +
      'The system prompt contains hardcoded credentials and permits prompt injection, making this deployment unsafe for production use. ' +
      'Immediate remediation is required. Apply Trend Vision One AI Guard to block attacks while hardening the underlying configuration.',
  };
}
