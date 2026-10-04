export type LicenseStatus =
  | 'free'
  | 'trial'
  | 'active'
  | 'expired'
  | 'invalid'
  | 'grace_period';

export type PaymentProvider = 'lemonsqueezy' | 'gumroad';

export interface LicenseInfo {
  key: string | null;
  provider: PaymentProvider;
  status: LicenseStatus;
  plan: 'lifetime' | 'monthly';
  activationDate: number | null;
  lastValidated: number | null;
  expiresAt: number | null;
  deviceCount: number;
  maxDevices: number;
  orderId?: string;
  customerEmail?: string;
  instanceId?: string; // used for deactivation / device limit
}

export interface TrialInfo {
  installedAt: number;
  trialDays: number;
  trialEnded: boolean;
}

export interface LicenseVerificationResult {
  valid: boolean;
  status: LicenseStatus;
  message?: string;
  instanceId?: string;
  expiresAt?: number | null;
  customerEmail?: string;
  orderId?: string;
  deviceCount?: number;
  maxDevices?: number;
}
