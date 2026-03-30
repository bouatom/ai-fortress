# API Keys

Both API keys come from your **rented Vision One instance**. You will receive access credentials for the instance as part of the demo environment provisioning.

---

## Vision One API Key

### Step 1: Log In to Your Vision One Instance

Use the credentials provided with your rented instance to log in to the Vision One Console.

### Step 2: Create the API Key

1. Navigate to **Administration → API Keys → Add API Key**
2. Name: `ai-fortress-demo`
3. Expiry: Set to end of your demo period
4. Permissions:
   - **AI Security** → Full Access
5. Click **Add**
6. **Copy the key immediately** — it's only shown once

### Step 3: Verify the Key

```bash
curl -X POST \
  "https://api.xdr.trendmicro.com/v3.0/aiSecurity/applyGuardrails" \
  -H "Authorization: TMV1-Bearer YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -H "TMV1-Application-Name: ai-fortress-test" \
  -d '{"prompt": "hello world"}'
```

Expected response: `{"action": "allow", "reasons": []}`

---

## TMAS API Key

### Step 1: Navigate to Artifact Scanner

In the Vision One Console → **Cloud Security → Artifact Scanner**

### Step 2: Create API Key

1. Click **Manage API Keys → Add API Key**
2. Name: `ai-fortress-demo`
3. Copy the key

---

## Region Reference

| Instance Region | V1_REGION | API Base URL |
|-----------------|-----------|-------------|
| US / Americas | `us-1` | `api.xdr.trendmicro.com` |
| Europe | `eu-1` | `api.eu.xdr.trendmicro.com` |
| Asia Pacific | `ap-1` | `api.ap.xdr.trendmicro.com` |
| Japan | `jp-1` | `api.xdr.trendmicro.co.jp` |

!!! danger "Region Mismatch"
    If your `V1Region` doesn't match your instance, all AI Guard calls will return 401 Unauthorized. This is the most common setup error.
