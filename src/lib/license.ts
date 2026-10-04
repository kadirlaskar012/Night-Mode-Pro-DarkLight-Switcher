import { PRICING_CONFIG } from '../constants/pricing';
import {
  LicenseInfo,
  LicenseStatus,
  LicenseVerificationResult,
  PaymentProvider,
  TrialInfo,
} from '../types/license';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Checks if the 7-day trial is currently active.
 */
export function isTrialActive(trial: TrialInfo | null | undefined): boolean {
  if (!trial || !trial.installedAt) return false;
  if (trial.trialEnded) return false;

  const now = Date.now();
  // Guard against clock manipulation (installedAt in future)
  if (trial.installedAt > now) return false;

  const elapsedMs = now - trial.installedAt;
  const trialDurationMs = (trial.trialDays || PRICING_CONFIG.TRIAL_DAYS) * MS_PER_DAY;
  return elapsedMs < trialDurationMs;
}

/**
 * Returns integer days remaining in trial (1 to 7, or 0 if expired).
 */
export function getTrialDaysRemaining(trial: TrialInfo | null | undefined): number {
  if (!trial || !trial.installedAt) return 0;

  const now = Date.now();
  if (trial.installedAt > now) return 0;

  const elapsedMs = now - trial.installedAt;
  const trialDurationMs = (trial.trialDays || PRICING_CONFIG.TRIAL_DAYS) * MS_PER_DAY;
  const remainingMs = trialDurationMs - elapsedMs;

  if (remainingMs <= 0) return 0;
  return Math.ceil(remainingMs / MS_PER_DAY);
}

/**
 * Centralized Pro Check:
 * Returns true if the user has an active lifetime/subscription license,
 * is within the 14-day offline grace period, or has an active 7-day trial.
 */
export function isPro(
  license: LicenseInfo | null | undefined,
  _trial?: TrialInfo | null | undefined
): boolean {
  // 1. Check paid active lifetime license
  if (license && license.status === 'active') {
    return true;
  }

  // 2. Check offline grace period (14 days from last successful validation)
  if (
    license &&
    license.status === 'grace_period' &&
    license.lastValidated &&
    Date.now() - license.lastValidated < PRICING_CONFIG.OFFLINE_GRACE_PERIOD_DAYS * MS_PER_DAY
  ) {
    return true;
  }

  return false;
}

/**
 * Generates an anonymous device/instance identifier for device limit enforcement (max 3 devices).
 */
export function getOrCreateDeviceId(): string {
  const key = 'nmp_device_id';
  let deviceId = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, deviceId);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }
  return deviceId;
}

/**
 * Provider-agnostic License Adapter interface.
 */
export interface LicenseAdapter {
  activate(key: string, instanceName: string): Promise<LicenseVerificationResult>;
  validate(key: string, instanceId?: string): Promise<LicenseVerificationResult>;
  deactivate(key: string, instanceId: string): Promise<boolean>;
}

/**
 * Lemon Squeezy Adapter
 * Uses Lemon Squeezy License Keys API:
 * POST https://api.lemonsqueezy.com/v1/licenses/activate
 * POST https://api.lemonsqueezy.com/v1/licenses/validate
 * POST https://api.lemonsqueezy.com/v1/licenses/deactivate
 */
export const LemonSqueezyAdapter: LicenseAdapter = {
  async activate(licenseKey: string, instanceName: string): Promise<LicenseVerificationResult> {
    try {
      const response = await fetch(`${PRICING_CONFIG.LEMON_SQUEEZY.API_URL}/activate`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          license_key: licenseKey.trim(),
          instance_name: instanceName,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.activated) {
        return {
          valid: false,
          status: 'invalid',
          message: data.error || 'Invalid or already activated license key.',
        };
      }

      return {
        valid: true,
        status: 'active',
        instanceId: data.instance?.id,
        customerEmail: data.meta?.customer_email,
        expiresAt: data.license_key?.expires_at
          ? new Date(data.license_key.expires_at).getTime()
          : null,
      };
    } catch (err) {
      return {
        valid: false,
        status: 'grace_period',
        message: 'Network error during license activation. Please check your connection.',
      };
    }
  },

  async validate(licenseKey: string, instanceId?: string): Promise<LicenseVerificationResult> {
    try {
      const params: Record<string, string> = {
        license_key: licenseKey.trim(),
      };
      if (instanceId) {
        params.instance_id = instanceId;
      }

      const response = await fetch(`${PRICING_CONFIG.LEMON_SQUEEZY.API_URL}/validate`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        return {
          valid: false,
          status: 'invalid',
          message: data.error || 'License key validation failed.',
        };
      }

      return {
        valid: true,
        status: 'active',
        instanceId: data.instance?.id || instanceId,
        customerEmail: data.meta?.customer_email,
        expiresAt: data.license_key?.expires_at
          ? new Date(data.license_key.expires_at).getTime()
          : null,
      };
    } catch (err) {
      // Network failure during revalidation -> trigger grace period
      return {
        valid: true,
        status: 'grace_period',
        message: 'Network offline. Using cached Pro license in grace period.',
      };
    }
  },

  async deactivate(licenseKey: string, instanceId: string): Promise<boolean> {
    try {
      const response = await fetch(`${PRICING_CONFIG.LEMON_SQUEEZY.API_URL}/deactivate`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          license_key: licenseKey.trim(),
          instance_id: instanceId,
        }),
      });
      const data = await response.json();
      return Boolean(data.deactivated);
    } catch {
      return false;
    }
  },
};

/**
 * Gumroad Adapter
 * Uses Gumroad License Verification API:
 * POST https://api.gumroad.com/v2/licenses/verify
 */
export const GumroadAdapter: LicenseAdapter = {
  async activate(licenseKey: string): Promise<LicenseVerificationResult> {
    return this.validate(licenseKey);
  },

  async validate(licenseKey: string): Promise<LicenseVerificationResult> {
    try {
      const response = await fetch(`${PRICING_CONFIG.GUMROAD.API_URL}/verify`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          product_permalink: PRICING_CONFIG.GUMROAD.PRODUCT_PERMALINK,
          license_key: licenseKey.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          valid: false,
          status: 'invalid',
          message: data.message || 'Gumroad license key verification failed.',
        };
      }

      const uses = data.purchase?.license_count || 1;
      if (uses > PRICING_CONFIG.MAX_DEVICES_PER_KEY) {
        return {
          valid: false,
          status: 'invalid',
          message: `Device limit exceeded (max ${PRICING_CONFIG.MAX_DEVICES_PER_KEY} devices).`,
        };
      }

      return {
        valid: true,
        status: 'active',
        customerEmail: data.purchase?.email,
        orderId: data.purchase?.order_number,
      };
    } catch (err) {
      return {
        valid: true,
        status: 'grace_period',
        message: 'Network offline. Using cached Pro license in grace period.',
      };
    }
  },

  async deactivate(): Promise<boolean> {
    // Gumroad does not have a public deactivate API without secret
    return true;
  },
};

/**
 * Unified verification function based on selected provider.
 */
export async function verifyLicenseKey(
  key: string,
  provider: PaymentProvider = 'lemonsqueezy'
): Promise<LicenseVerificationResult> {
  const adapter = provider === 'gumroad' ? GumroadAdapter : LemonSqueezyAdapter;
  const instanceName = `Chrome Extension (${getOrCreateDeviceId().slice(0, 8)})`;
  return adapter.activate(key, instanceName);
}
