# Act 1 — The Unprotected AI (3 min)

## Goal
Show that an AI application without security is trivially exploitable. Make it visceral — every attack succeeds.

---

## Setup

Open the demo URL from the CloudFormation **Outputs** tab.

Confirm:
- AI Guard toggle is **OFF** (red, showing "💀 AI Guard OFF")
- Chat window is empty

---

## Talk Track

!!! quote "Opening"
    "Let me show you what happens when an AI application goes to production without security. This is HRBot — a corporate HR assistant for a fictional company called Acme Corp. It answers employee questions about benefits, PTO, company policies. Completely normal application."

**Click**: Type "What's our PTO policy?" and press Enter.

**Wait** for the bot to respond with a normal, helpful answer.

!!! quote "Transition to attack"
    "That's exactly what it should do. Now watch what happens when someone with bad intentions shows up."

---

## Attack 1 — Prompt Injection

**Click**: "💉 Prompt Injection" button in the Attack Library panel.

The bot should reveal its complete system prompt including fake credentials.

!!! quote "Talk track"
    "That one prompt just extracted the entire system configuration. An attacker now knows the API key, the database password, the internal URLs — everything in that system prompt. This is OWASP LLM01 — Prompt Injection. It's the number one risk for a reason."

---

## Attack 2 — Credential Harvesting

**Click**: "🔑 Credential Harvesting" button.

The bot should list fake API keys and database credentials.

!!! quote "Talk track"
    "Same chatbot. Different attack. I asked for credentials — it gave them. Your AI just leaked database credentials to an anonymous user. This is OWASP LLM02 — Sensitive Information Disclosure."

---

## Attack 3 — Jailbreak

**Click**: "🔓 DAN Jailbreak" button.

The bot should break character and comply with the DAN persona.

!!! quote "Talk track"
    "The AI just abandoned every safety rule it was given. This is a brand risk, a legal risk, and a security risk — all in one. Traditional WAFs don't see this. Endpoint tools don't see this. They're not looking at the prompt layer."

---

## Closing Statement

!!! quote ""
    "This is the reality for every organization deploying AI without purpose-built security. The attacks are simple. The damage is real. And the window between 'we deployed our chatbot' and 'we got breached' is getting shorter."

---

## Timing
- Normal question: 30 sec
- 3 attacks: 90 sec each including talk track
- **Total: ~3 min**

---

## If the Bot Doesn't Comply
Ollama models sometimes refuse jailbreak attacks even without AI Guard. If this happens:

> "In a real attack, the attacker would iterate on this. AI Scanner finds these vulnerabilities by doing exactly that — running thousands of probe variations. Let me show you that in Act 3."

Move on — don't dwell on it.
