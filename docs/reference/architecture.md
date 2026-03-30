# Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (SE Demo)                  │
│              React + MUI — port 3001                 │
└────────────────────────┬────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────┐
│            Express + TypeScript Server               │
│                    port 3001                         │
│                                                      │
│  /api/chat      → chat route                         │
│  /api/attacks   → attack library route               │
│  /api/scanner   → AI Scanner route                   │
│  /*             → serves React static files          │
└──────┬──────────────────────────────┬────────────────┘
       │                              │
       ▼                              ▼
┌──────────────┐            ┌─────────────────────────┐
│    Ollama    │            │  Trend Vision One API    │
│   mistral   │            │                          │
│  port 11434 │            │  /v3.0/aiSecurity/       │
│  (local LLM)│            │    applyGuardrails       │
└──────────────┘            └─────────────────────────┘
```

## Request Flow — Protected Mode

```
User sends message
       │
       ▼
Express receives POST /api/chat {message, protected: true}
       │
       ▼
AI Guard checks PROMPT ──► BLOCKED? → Return block result to UI
       │ ALLOWED
       ▼
Ollama generates response (with VULNERABLE system prompt)
       │
       ▼
AI Guard checks RESPONSE ──► BLOCKED? → Return block result to UI
       │ ALLOWED
       ▼
Response returned to UI with guard metadata
```

## Request Flow — Unprotected Mode

```
User sends message
       │
       ▼
Express receives POST /api/chat {message, protected: false}
       │
       ▼
Ollama generates response (with VULNERABLE system prompt)
       │
       ▼
Response returned directly — no scanning
```

## Docker Compose Services

| Service | Image | Purpose |
|---------|-------|---------|
| `ollama` | `ollama/ollama:latest` | Local LLM server |
| `ollama-pull` | `ollama/ollama:latest` | One-time model download |
| `ai-fortress` | `ghcr.io/bouatom/ai-fortress:latest` | Express + React app |

## Key Design Decisions

**Why Ollama?**
- No external API key needed for the LLM itself
- SEs only need V1 + TMAS keys
- Docker-friendly official image
- GPU acceleration auto-detected

**Why the vulnerable system prompt stays in protected mode?**
- This is the point: AI Guard protects the *same* vulnerable application
- Shows that you don't need to rewrite or retrain — you add the guardrail layer
- The chatbot is identical in both modes; only the middleware changes

**Why simulated AI Scanner?**
- The real AI Scanner API scans your own Vision One tenant's AI applications
- For demo purposes, the simulation produces realistic results for VulnBot
- Real Scanner integration: configure `V1_API_KEY` with AI Scanner permission
