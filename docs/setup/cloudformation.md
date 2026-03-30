# Getting Your Demo URL

When you start the AI Fortress experience in PX, the CloudFormation stack is automatically provisioned in your dedicated AWS account. You do not need to deploy or configure anything manually — just find the URL.

---

## Step 1: Open Your AWS Console

In the PX sidebar, click the **SSO Login** button under the AWS panel (cloud icon) to open your dedicated AWS console.

!!! tip "Stack Still Provisioning?"
    The CloudFormation stack status shows in the PX sidebar AWS panel. Wait until it no longer shows "Provisioning Stack!" before proceeding — typically 8-10 minutes after starting the experience (includes GPU driver installation).

---

## Step 2: Find the Demo URL

1. In the AWS Console, navigate to **CloudFormation → Stacks**
2. Click the **ai-fortress** stack
3. Open the **Outputs** tab

| Output | Description |
|--------|-------------|
| **DemoURL** | `http://x.x.x.x:3001` — your demo URL |

Copy the **DemoURL** value and open it in your browser.

!!! warning "Wait for Model Download"
    The first-run Ollama model download takes an additional 3-10 minutes after the stack completes. If the page loads but chat returns no response, the model is still pulling. This only happens on first start.

---

## Step 3: Configure API Keys

Once the app loads, navigate to **Settings** (`/settings`) and paste your Vision One and TMAS API keys. Hit **Apply** — keys take effect immediately.

[API Keys →](api-keys.md)
