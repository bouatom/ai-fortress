# AI Fortress — Operator's Guide

!!! success "What You Can Do With AI Fortress"
    Run a **11-minute, self-contained demo** that shows prospects exactly what happens when an AI application goes live unprotected — and how Vision One shuts it down.

## What Is AI Fortress?

AI Fortress is a purpose-built SE demo tool that tells the full **Trend Vision One AI security story** across three products:

| Product | What It Demos |
|---------|---------------|
| **AI Guard** | Runtime prompt protection — blocks attacks in real-time |
| **AI Scanner** | Pre-deployment vulnerability scanning — catches issues before go-live |
| **TMAS** | Container security — secrets, CVEs, SBOM for the AI app's container |

The demo centers on **VulnBot** — an intentionally vulnerable HR chatbot running on a local LLM. SEs attack it live, flip a toggle to enable AI Guard, and watch all attacks get blocked.

---

## Quick Start — Three Steps

=== "1. Get Demo URL"
    PX automatically deploys the CloudFormation stack when you start the experience. Once provisioning is complete, open your AWS console via the PX sidebar SSO link → **CloudFormation → ai-fortress → Outputs** → copy **DemoURL**.

    [Get Demo URL →](setup/cloudformation.md)

=== "2. Configure"
    Open the demo URL in your browser and navigate to **Settings** (`/settings`).

    Paste your Vision One and TMAS API keys, hit **Apply**. Keys go live instantly — no restart.

    [API Keys →](setup/api-keys.md)

=== "3. Demo"
    AI Guard is active. Run the 11-minute demo script.

    [Demo Script →](demo-script/overview.md)

---

## Demo Flow (11 minutes)

```
Act 1 (3 min)  → Attack the unprotected chatbot — all attacks succeed
Act 2 (3 min)  → Flip the AI Guard toggle — same attacks, all blocked
Act 3 (2 min)  → Run AI Scanner — finds the vulnerabilities pre-deployment
Act 4 (2 min)  → Show TMAS — secrets + CVEs in the container
Act 5 (1 min)  → OWASP scorecard — 9/10 risks covered
```

[Full Demo Script →](demo-script/overview.md)

---

## Before You Demo — Discovery Questions

!!! tip "Qualify the opportunity first"
    Ask these questions before opening the app. The answers tell you which acts to emphasize.

| Question | What to Listen For |
|----------|-------------------|
| "Are you building or deploying any AI/LLM applications today?" | Names chatbots, copilots, RAG systems = greenfield opportunity |
| "How are you currently securing your AI applications against prompt injection?" | "We're not" = pain. Competitor name = displacement |
| "Has your security team raised concerns about data leakage through AI tools?" | DLP concerns = strong AI Guard angle |
| "Do employees use shadow AI — ChatGPT, Copilot — without IT approval?" | "We can't control it" = ZTSA angle |
| "Do you have compliance requirements around AI — SOC 2, HIPAA, EU AI Act?" | Regulatory pressure = urgency |

### Buying Signal Keywords

When you hear these words, emphasize the matching act:

| Keyword | Act to Emphasize |
|---------|-----------------|
| "prompt injection" | Act 1 + Act 2 |
| "data leakage" / "PII exposure" | Act 2 (AI Guard response scanning) |
| "OWASP" | Act 5 (scorecard) |
| "red team" / "pen test our AI" | Act 3 (AI Scanner) |
| "shift left" / "DevSecOps for AI" | Act 3 + Act 4 |
| "container" / "Kubernetes" / "CI/CD" | Act 4 (TMAS) |
| "compliance" / "audit" | Act 5 + governance story |

---

## What's Inside

```
ai-fortress/
├── server/          # Express + TypeScript backend
├── client/          # React + MUI frontend
├── docker-compose.yml
├── Dockerfile
├── cloudformation.yml
└── docs/            # This guide
```

**LLM**: Ollama with mistral (GPU-accelerated on g4dn.xlarge — fast inference, less RLHF-restricted so demo attacks land). No OpenAI key needed. Only Vision One + TMAS keys are required — entered via the **Settings** page after deployment.
