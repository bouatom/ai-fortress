# Demo Script Overview

**Total time: ~11 minutes**

The AI Fortress demo tells one story in five acts: an AI application that's wide open to attack, then locked down with Vision One — zero code changes.

---

## The Story

> *"Most organizations deploying AI have no idea their chatbots are vulnerable to the same attacks that've been in hacker toolkits for two years. Let me show you what that looks like — and what it looks like when you fix it."*

## Five Acts

| Act | Time | What Happens | Key Takeaway |
|-----|------|-------------|-------------|
| **1 — Unprotected** | 3 min | Attack the vulnerable chatbot — all succeed | "This is the reality without AI security" |
| **2 — AI Guard** | 3 min | Enable AI Guard — same attacks, all blocked | "One API call. Zero code changes." |
| **3 — AI Scanner** | 2 min | Scan the model — finds the same vulnerabilities | "Shift left. Catch it before go-live." |
| **4 — TMAS** | 2 min | Scan the container — secrets detected | "Three layers: container, model, runtime" |
| **5 — OWASP** | 1 min | Show coverage scorecard — 9/10 | "The most comprehensive AI security story" |

---

## Pre-Demo Checklist

Before opening the app with the prospect:

- [ ] Demo URL retrieved: PX sidebar → AWS SSO Login → **CloudFormation → ai-fortress → Outputs → DemoURL** — page loads
- [ ] API keys are configured: go to **Settings** → both Vision One and TMAS keys show as **Set**
- [ ] AI Guard is active: visit `<demo-url>/health` → confirm `"guardEnabled": true`
- [ ] Test normal chat: ask "What's the PTO policy?" — get a normal response
- [ ] AI Guard toggle starts in **OFF** position on the Demo tab
- [ ] Browser is full-screen or at least wide enough to show both panels

!!! warning "Keys Not Set?"
    Open **Settings** (`/settings`), paste your Vision One and TMAS API keys, and hit **Apply**. Keys take effect immediately — no restart required.

---

## Demo Reset Between Meetings

The app is stateless — just refresh the browser (F5) to clear chat history.

## Qualifying First

!!! tip "Run discovery BEFORE opening the app"
    The discovery questions are on the [Home page](../index.md). Ask them before opening the browser. The answers tell you which acts to emphasize.
