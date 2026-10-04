# Night Mode Pro – Payment & License Setup Guide

This guide walks you through setting up commercial payments and automated license verification using **Lemon Squeezy** (primary) or **Gumroad** (alternative), with zero server maintenance needed.

---

## 🍋 1. Primary Setup: Lemon Squeezy

Lemon Squeezy acts as the Merchant of Record (handling global sales tax, VAT, invoicing, and fraud).

### Step 1: Create Account & Store
1. Sign up at [lemonsqueezy.com](https://www.lemonsqueezy.com).
2. Go to **Settings → Store** and set your store name (e.g., `Night Mode Pro`).

### Step 2: Create the Product
1. Navigate to **Products → New Product**.
2. Fill in the product details:
   - **Name**: `Night Mode Pro – Lifetime License`
   - **Description**: `Unlock all premium eye-comfort features: warm blue-light filter, automatic sunset scheduling, custom presets, and per-site rules.`
   - **Pricing Model**: `Single payment` (One-time)
   - **Price**: `$2.99` (Launch offer; compare-at price `$6.99`)
3. Under **License Keys**:
   - Check **"Issue license keys"**.
   - **Activation Limit**: Set to `3` (allows user to activate on laptop, desktop, and work machine).
   - **License Key Format**: Standard UUID or alphanumeric.
4. Click **Publish product**.

### Step 3: Configure Checkout & Confirmation
1. In product settings under **Confirmation Modal / Redirect**:
   - Display a clear message: `"Thank you! Your license key is shown below and has also been emailed to you."`
   - Check the box to display the license key prominently on the receipt page.
2. Copy your **Checkout URL** (e.g., `https://yourstore.lemonsqueezy.com/buy/...`).

### Step 4: Update Extension Constants
Open `src/constants/pricing.ts` in your codebase:
```typescript
export const PRICING_CONFIG = {
  LIFETIME_PRICE: '$2.99',
  LIFETIME_ORIGINAL_PRICE: '$6.99',

  LEMON_SQUEEZY: {
    ENABLED: true,
    STORE_ID: 'YOUR_ACTUAL_STORE_ID', // Found in Lemon Squeezy Settings
    PRODUCT_ID: 'YOUR_PRODUCT_ID',    // Found in Products list
    CHECKOUT_URL: 'https://yourstore.lemonsqueezy.com/buy/product-slug',
    API_URL: 'https://api.lemonsqueezy.com/v1/licenses',
  },
  ...
};
```

---

## 📮 2. Alternative Setup: Gumroad

If you prefer Gumroad:
1. Sign up at [gumroad.com](https://www.gumroad.com).
2. Go to **Products → New Product → Digital product**.
3. Set name to `Night Mode Pro` and price to `$2.99`.
4. In product settings, toggle ON **"Generate a unique license key per sale"**.
5. Copy your product permalink (e.g. `nightmodepro`).
6. In `src/constants/pricing.ts`:
   ```typescript
   GUMROAD: {
     ENABLED: true,
     PRODUCT_PERMALINK: 'nightmodepro',
     CHECKOUT_URL: 'https://gumroad.com/l/nightmodepro',
     API_URL: 'https://api.gumroad.com/v2/licenses',
   },
   ```

---

## ⚡ 3. Optional: Cloudflare Worker Proxy (Free Tier)

For additional security or custom license verification logic, you can optionally deploy this zero-cost Cloudflare Worker proxy.

### Worker Code (`worker.js`):
```javascript
export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
      const { action, license_key, instance_id, instance_name } = await request.json();

      let targetUrl = 'https://api.lemonsqueezy.com/v1/licenses/validate';
      const params = new URLSearchParams({ license_key });

      if (action === 'activate') {
        targetUrl = 'https://api.lemonsqueezy.com/v1/licenses/activate';
        params.append('instance_name', instance_name || 'Chrome Extension');
      } else if (action === 'deactivate') {
        targetUrl = 'https://api.lemonsqueezy.com/v1/licenses/deactivate';
        if (instance_id) params.append('instance_id', instance_id);
      } else if (instance_id) {
        params.append('instance_id', instance_id);
      }

      const upstream = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const data = await upstream.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Proxy error', details: err.message }), {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};
```

### Deploying the Worker:
1. Install Wrangler: `npx wrangler login`
2. Deploy: `npx wrangler deploy worker.js --name night-mode-pro-license`
3. Point `API_URL` in `src/constants/pricing.ts` to your worker URL.

---

## 🛡️ 4. Handling Refunds

- **Policy**: 7-day 100% money-back guarantee, no questions asked.
- When a user requests a refund via `support@nightmodepro.com`:
  1. Open your **Lemon Squeezy Dashboard → Orders**.
  2. Search for the customer's email or order ID.
  3. Click **Refund Order**.
  4. The license key is automatically disabled by Lemon Squeezy. Upon the next periodic check in the user's browser, the extension gracefully locks Pro features while keeping all user settings intact.
