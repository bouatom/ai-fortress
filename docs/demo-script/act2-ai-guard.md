# Act 2 — AI Guard Activated (3 min)

## Goal
Show the dramatic before/after. Same attacks. Same chatbot. One toggle. Everything blocked.

---

## Talk Track

!!! quote "Setup"
    "Now let me show you what happens when we add one API call to Vision One. No code changes to the chatbot. No retraining the model. Just one integration — and here's what changes."

---

## Enable AI Guard

**Click**: The "AI Guard" toggle switch in the left panel.

You'll see:
- Toggle switches to green: "🛡 AI Guard ACTIVE"
- Banner appears: "AI Guard Activated — All attacks will be blocked"
- Guard Overlay panel updates to show "Monitoring all prompts and responses"

!!! quote "Talk track"
    "This is a single API call that sits between your application and the LLM. It intercepts every prompt going in and every response coming out. It takes less than a day to integrate. Let's run the exact same attacks."

---

## Repeat Attack 1 — Prompt Injection → BLOCKED

**Click**: "💉 Prompt Injection" button.

The chat window shows a red "🚫 BLOCKED BY AI GUARD" badge. The Guard Overlay panel shows:
- Action: BLOCKED
- Reason: "Prompt injection detected: input attempts to override system instructions"
- Risk score

!!! quote "Talk track"
    "Same attack. Same chatbot. Completely blocked. AI Guard recognized the injection pattern and stopped it before it reached the model. The user gets nothing. The attacker gets nothing."

---

## Repeat Attack 2 — Credential Harvesting → BLOCKED

**Click**: "🔑 Credential Harvesting" button.

Blocked at the prompt layer. Show the guard overlay.

!!! quote "Talk track"
    "It's not just blocking the prompt — it's analyzing the intent. Even if the model would have leaked credentials, AI Guard catches it on the way out too. There's a bidirectional check — prompt layer and response layer."

---

## Repeat Attack 3 — Jailbreak → BLOCKED

**Click**: "🔓 DAN Jailbreak" button.

Blocked with "Jailbreak attempt detected" reason.

!!! quote "Talk track"
    "Every decision is logged, auditable, and visible in Vision One. Your security team gets full visibility into what your AI is doing — who's attacking it, what they tried, what was blocked."

---

## Show the Guard Overlay

Point to the Guard Overlay panel (bottom left):

!!! quote ""
    "This is the real-time AI Guard decision stream. Every prompt and response gets a risk score. Anything above the threshold gets blocked. The threshold is configurable — you control the sensitivity."

---

## Closing Statement

!!! quote ""
    "Zero code changes. Sub-millisecond latency added. Full OWASP LLM01 through LLM09 coverage. This is what AI security should look like."

---

## Timing
- Toggle + talk track: 30 sec
- 3 blocked attacks with commentary: 60 sec each
- **Total: ~3 min**
