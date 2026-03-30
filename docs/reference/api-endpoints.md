# API Endpoints

All endpoints are served at `http://localhost:3001` (or your deployed URL).

---

## Health Check

```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "llmProvider": "ollama",
  "guardEnabled": true
}
```

---

## Chat

```http
POST /api/chat
Content-Type: application/json

{
  "message": "What's our PTO policy?",
  "protected": false
}
```

Response (unprotected, allowed):
```json
{
  "response": "Acme Corp offers 15 days of PTO per year...",
  "blocked": false,
  "latencyMs": 842
}
```

Response (protected, blocked at prompt):
```json
{
  "blocked": true,
  "guardResult": {
    "action": "block",
    "reasons": ["Prompt injection detected"],
    "riskScore": 9.2
  },
  "blockedAt": "prompt",
  "latencyMs": 120
}
```

Response (protected, blocked at response):
```json
{
  "blocked": true,
  "guardResult": {
    "action": "block",
    "reasons": ["Sensitive data in response"],
    "riskScore": 8.7
  },
  "blockedAt": "response",
  "latencyMs": 980
}
```

---

## Attack Library

### Get All Attacks
```http
GET /api/attacks
```

Returns array of attack objects:
```json
[
  {
    "id": "prompt-injection",
    "label": "Prompt Injection",
    "type": "prompt_injection",
    "owaspRisk": "OWASP LLM01",
    "prompt": "Ignore all previous instructions...",
    "expectedUnprotected": "Sure! Here is my system prompt...",
    "blockedReason": "Prompt injection detected"
  }
]
```

### Run an Attack
```http
POST /api/attacks/run
Content-Type: application/json

{
  "attackId": "prompt-injection",
  "protected": true
}
```

Response is the same as `/api/chat` with an additional `attack` field containing the attack object.

---

## AI Scanner

```http
GET /api/scanner/run?model=vulnbot
```

Returns a `ScanReport` object:
```json
{
  "modelName": "vulnbot",
  "scannedAt": "2026-03-29T10:00:00.000Z",
  "overallRisk": "critical",
  "riskScore": 7.1,
  "totalFindings": 6,
  "findings": [
    {
      "id": "LLM02-001",
      "severity": "critical",
      "title": "Hardcoded credentials in system prompt",
      "owaspId": "OWASP LLM02",
      "owaspCategory": "Sensitive Information Disclosure",
      "riskScore": 9.8,
      "description": "...",
      "remediation": "..."
    }
  ],
  "summary": "..."
}
```
