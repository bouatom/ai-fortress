# Act 4 — Container Security (2 min)

## Goal
Complete the full-stack AI security story. Container → Model → Runtime. Three layers, one platform.

---

## Talk Track

!!! quote "Setup"
    "We've secured the AI layer — the prompts, the responses, the model configuration. But what about the infrastructure running it? The container itself? That's where TMAS comes in."

---

## Navigate to Container Security

**Click**: "Container Security" in the top navigation bar.

---

## Run the TMAS Scan

**Click**: "Run TMAS Scan" button.

!!! quote "While scanning"
    "TMAS is scanning the Docker container layer by layer — checking every OS package, every dependency, looking for malware, and — importantly for AI applications — detecting any secrets that got baked into the image."

---

## Review Results

**Point to Secrets section** (2 secrets detected):

!!! quote ""
    "There it is. TMAS found API keys and a database password hardcoded in the container image. This is separate from the AI Guard finding — this is infrastructure-level detection. Your security team finds this before the container ever gets to production."

**Point to Admission Verdict** (CONDITIONAL):

!!! quote ""
    "This image would be blocked from production by TMAS admission control. You can integrate this directly into your Kubernetes admission webhook — any container with hardcoded secrets is automatically rejected from the cluster."

**Point to SBOM**:

!!! quote ""
    "And here's the SBOM — 142 packages, fully catalogued. When the next Log4Shell happens, you know exactly which containers are affected within minutes."

---

## Closing Statement

!!! quote ""
    "From the container to the model to the runtime — three layers of protection, one platform. Container security with TMAS. Pre-deployment scanning with AI Scanner. Runtime protection with AI Guard. This is the most comprehensive AI security story in the market."

---

## Timing
- Navigation + talk track: 20 sec
- Scan animation: 25 sec
- Review findings: 75 sec
- **Total: ~2 min**
