# Prerequisites

## What You Need Before Starting

| Item | Details |
|------|---------|
| **Vision One API Key** | From your rented Vision One instance — needs AI Security entitlement |
| **TMAS API Key** | From your rented Vision One instance → Cloud Security → Artifact Scanner |

!!! info "AWS and Infrastructure"
    The AWS account, CloudFormation stack, and EC2 instance are all automatically provisioned by PX when you start the experience. No AWS account or local setup required.

---

## Getting and Applying Your API Keys

Your API keys come from your **rented Vision One instance** — provided when the experience starts via the PX sidebar SSO link.

Once you have the keys, apply them via the **Settings** page (`/settings`) in the running app. See [API Keys](api-keys.md) for where to find them in Vision One.

---

## Region Reference

Your Vision One instance region determines which API endpoint is used. The most common is `us-1`.

| Instance Region | V1_REGION |
|-----------------|-----------|
| US / Americas | `us-1` |
| Europe | `eu-1` |
| Asia Pacific | `ap-1` |
| Japan | `jp-1` |

!!! warning "Region Matters"
    If the region in Settings doesn't match your Vision One instance, AI Guard calls will return 401 Unauthorized.
