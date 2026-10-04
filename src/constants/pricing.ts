/**
 * Night Mode Pro - Pricing & License Constants
 * Single source of truth for pricing, trials, URLs and payment provider configs.
 */
export const PRICING_CONFIG = {
  // Lifetime one-time offer
  LIFETIME_PRICE: '$2.99',
  LIFETIME_ORIGINAL_PRICE: '$6.99',
  LIFETIME_TAGLINE: 'One-time payment • No subscription • Lifetime updates',

  // Optional recurring monthly plan (can be toggled off)
  ENABLE_MONTHLY_PLAN: false,
  MONTHLY_PRICE: '$0.99',
  MONTHLY_INTERVAL: '/month',

  // Trial duration
  TRIAL_DAYS: 7,

  // License revalidation & offline grace period
  REVALIDATION_INTERVAL_DAYS: 7,
  OFFLINE_GRACE_PERIOD_DAYS: 14,
  MAX_DEVICES_PER_KEY: 3,

  // Lemon Squeezy configuration
  LEMON_SQUEEZY: {
    ENABLED: true,
    STORE_ID: 'YOUR_STORE_ID',
    PRODUCT_ID: 'YOUR_PRODUCT_ID',
    CHECKOUT_URL: 'https://nightmodepro.lemonsqueezy.com/buy/demo-night-mode-pro',
    API_URL: 'https://api.lemonsqueezy.com/v1/licenses',
  },

  // Gumroad alternative configuration
  GUMROAD: {
    ENABLED: true,
    PRODUCT_PERMALINK: 'nightmodepro',
    CHECKOUT_URL: 'https://gumroad.com/l/nightmodepro',
    API_URL: 'https://api.gumroad.com/v2/licenses',
  },

  // Support & refund
  REFUND_POLICY_DAYS: 7,
  SUPPORT_EMAIL: 'support@nightmodepro.com',
  WEBSITE_URL: 'https://nightmodepro.com',
  CHROME_STORE_URL: 'https://chromewebstore.google.com/detail/night-mode-pro',
} as const;
