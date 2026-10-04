import { describe, expect, it } from 'vitest';
import { PRICING_CONFIG } from '../src/constants/pricing';
import { getTrialDaysRemaining, isPro, isTrialActive } from '../src/lib/license';
import { LicenseInfo, TrialInfo } from '../src/types/license';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

describe('Licensing and Trial Logic', () => {
  it('reports active trial when within 7 days', () => {
    const trial: TrialInfo = {
      installedAt: Date.now() - 2 * MS_PER_DAY, // 2 days ago
      trialDays: 7,
      trialEnded: false,
    };
    expect(isTrialActive(trial)).toBe(true);
    expect(getTrialDaysRemaining(trial)).toBe(5);
  });

  it('reports expired trial when beyond trial duration', () => {
    const trial: TrialInfo = {
      installedAt: Date.now() - 8 * MS_PER_DAY, // 8 days ago
      trialDays: 7,
      trialEnded: false,
    };
    expect(isTrialActive(trial)).toBe(false);
    expect(getTrialDaysRemaining(trial)).toBe(0);
  });

  it('determines Pro status correctly', () => {
    const activeLicense: LicenseInfo = {
      key: 'TEST-123',
      provider: 'lemonsqueezy',
      status: 'active',
      plan: 'lifetime',
      activationDate: Date.now(),
      lastValidated: Date.now(),
      expiresAt: null,
      deviceCount: 1,
      maxDevices: 3,
    };

    const expiredTrial: TrialInfo = {
      installedAt: Date.now() - 10 * MS_PER_DAY,
      trialDays: 7,
      trialEnded: true,
    };

    // Paid user should always be Pro
    expect(isPro(activeLicense, expiredTrial)).toBe(true);

    // Free user after trial should not be Pro
    const freeLicense: LicenseInfo = {
      ...activeLicense,
      status: 'free',
      key: null,
    };
    expect(isPro(freeLicense, expiredTrial)).toBe(false);

    // In True Freemium model, free user is on Free tier (Pro features locked)
    expect(isPro(freeLicense)).toBe(false);

    // Grace period license (offline within 14 days) should remain Pro
    const graceLicense: LicenseInfo = {
      ...activeLicense,
      status: 'grace_period',
      lastValidated: Date.now() - 5 * MS_PER_DAY, // 5 days ago
    };
    expect(isPro(graceLicense, expiredTrial)).toBe(true);

    // Grace period expired (> 14 days)
    const expiredGraceLicense: LicenseInfo = {
      ...activeLicense,
      status: 'grace_period',
      lastValidated: Date.now() - 15 * MS_PER_DAY,
    };
    expect(isPro(expiredGraceLicense, expiredTrial)).toBe(false);
  });
});
