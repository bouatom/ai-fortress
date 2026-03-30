# OWASP Top 10 LLM 2025 — Vision One Coverage Map

| # | Risk | Vision One Coverage | Component | Demo Act |
|---|------|-------------------|-----------|---------|
| LLM01 | Prompt Injection | ✅ Full | AI Guard (prompt layer) | Act 1 + 2 |
| LLM02 | Sensitive Info Disclosure | ✅ Full | AI Guard (response layer) + AI Scanner | Act 1 + 2 + 3 |
| LLM03 | Supply Chain Vulnerabilities | ✅ Full | TMAS (dependency + image scanning) | Act 4 |
| LLM04 | Data and Model Poisoning | 🟡 Partial | AI Scanner (detects susceptibility) | Act 3 |
| LLM05 | Improper Output Handling | ✅ Full | AI Guard (response scanning) | Act 2 |
| LLM06 | Excessive Agency | ✅ Full | AI Guard (behavioral policy) | Act 1 + 2 |
| LLM07 | System Prompt Leakage | ✅ Full | AI Guard + AI Scanner | Act 1 + 2 + 3 |
| LLM08 | Vector and Embedding Weaknesses | 🟡 Partial | AI Scanner (RAG attack probes) | Act 3 |
| LLM09 | Misinformation / Hallucinations | ✅ Full | AI Guard (output quality checks) | Act 2 |
| LLM10 | Unbounded Consumption | 🟡 Partial | TMAS + rate limiting guidance | Act 4 |

**Coverage: 7 Full + 3 Partial = 9/10 risks covered**

---

## Talking Points for Each Risk

### LLM01 — Prompt Injection
The #1 risk. Demonstrated live in Act 1. AI Guard uses behavioral analysis (not just signatures) to detect injection patterns that evolve constantly.

### LLM02 — Sensitive Information Disclosure
Critical for regulated industries. AI Guard scans *responses* for credentials, PII, and internal infrastructure data — not just prompts. Bidirectional protection.

### LLM03 — Supply Chain
TMAS scans the container image layer by layer, including all dependencies pulled at build time. Integrates into GitHub Actions and Kubernetes admission webhooks.

### LLM04 — Data and Model Poisoning
AI Scanner probes for susceptibility. Full detection requires access to training pipelines — partial coverage for inference-layer detection.

### LLM07 — System Prompt Leakage
AI Scanner finds this in pre-deployment scanning. AI Guard blocks extraction attempts at runtime. Double protection.

### LLM09 — Hallucinations / Misinformation
AI Guard's output quality layer flags confident assertions about topics where the model shouldn't be authoritative. Configurable per application domain.
