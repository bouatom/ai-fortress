# Act 3 — AI Scanner (2 min)

## Goal
Show that AI Scanner would have caught these vulnerabilities *before deployment*. The shift-left message.

---

## Talk Track

!!! quote "Setup"
    "What if we could have caught these vulnerabilities before the application ever went live? That's what AI Scanner does — it's like a penetration test for your AI model, automated and integrated into your CI/CD pipeline."

---

## Navigate to AI Scanner

**Click**: "AI Scanner" in the top navigation bar.

---

## Run the Scan

**Click**: "Scan VulnBot" button.

Watch the animated scan progress:
- "Injecting probe prompts..."
- "Testing for prompt injection..."
- "Attempting system prompt extraction..."
- etc.

!!! quote "While scanning"
    "AI Scanner is running the same attacks we just ran manually — but automatically, across thousands of variations. It's red-teaming the model without a human in the loop."

---

## Review Results

When results appear:

**Point to Critical finding** (Hardcoded credentials):

!!! quote ""
    "This is what would have been caught if someone ran AI Scanner before deployment. Critical: system prompt contains hardcoded credentials. High: susceptible to direct prompt injection. This maps directly to the attacks we just saw succeed."

**Point to OWASP mapping chips** on each finding:

!!! quote ""
    "Every finding maps to an OWASP LLM risk category. This is the language your security auditors and compliance teams understand. This report goes into your audit log."

---

## Closing Statement

!!! quote ""
    "Shift left for AI. Scan before you ship, just like you scan containers and code. This goes directly into your CI/CD pipeline — it's a GitHub Action, a GitLab CI step. If the scan fails, the deployment stops."

---

## Timing
- Navigation + talk track: 20 sec
- Scan animation: 30 sec
- Review findings + talk track: 70 sec
- **Total: ~2 min**
