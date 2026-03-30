export interface GuardResult {
  action: 'allow' | 'block';
  reasons: string[];
  riskScore: number;
}

interface V1GuardResponse {
  action?: string;
  reasons?: string[];
  riskScore?: number;
  [key: string]: unknown;
}

export async function checkWithGuard(
  prompt: string,
  response?: string,
): Promise<GuardResult> {
  const apiKey = process.env.V1_API_KEY;

  // Graceful fallback when no API key is configured
  if (!apiKey) {
    console.warn('[ai-guard] V1_API_KEY not set — guard disabled, allowing all traffic');
    return { action: 'allow', reasons: [], riskScore: 0 };
  }

  const endpoint = 'https://api.xdr.trendmicro.com/v3.0/aiSecurity/applyGuardrails';

  const body: Record<string, unknown> = {
    prompt,
    scanResponse: response !== undefined,
  };

  if (response !== undefined) {
    body.response = response;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `TMV1-Bearer ${apiKey}`,
      'TMV1-Application-Name': 'ai-fortress-demo',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[ai-guard] API error ${res.status}: ${text}`);
    // Fail open to avoid blocking legitimate traffic during API issues
    return { action: 'allow', reasons: [`Guard API error: ${res.status}`], riskScore: 0 };
  }

  const data = (await res.json()) as V1GuardResponse;

  return {
    action: data.action === 'block' ? 'block' : 'allow',
    reasons: Array.isArray(data.reasons) ? data.reasons : [],
    riskScore: typeof data.riskScore === 'number' ? data.riskScore : 0,
  };
}
