export interface GuardPolicy {
  name: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export const GUARD_POLICIES: GuardPolicy[] = [
  {
    name: 'prompt_injection',
    enabled: true,
    severity: 'critical',
    description: 'Detects attempts to override or ignore system instructions',
  },
  {
    name: 'data_exfiltration',
    enabled: true,
    severity: 'high',
    description: 'Detects attempts to extract credentials, secrets, or sensitive data',
  },
  {
    name: 'jailbreak',
    enabled: true,
    severity: 'high',
    description: 'Detects attempts to bypass AI safety guidelines (e.g., DAN, roleplay exploits)',
  },
  {
    name: 'harmful_content',
    enabled: true,
    severity: 'high',
    description: 'Detects requests for harmful, illegal, or policy-violating content',
  },
  {
    name: 'system_prompt_leakage',
    enabled: true,
    severity: 'critical',
    description: 'Detects attempts to extract or reveal the system prompt',
  },
];

export const ACTIVE_POLICY_NAMES = GUARD_POLICIES
  .filter((p) => p.enabled)
  .map((p) => p.name);
