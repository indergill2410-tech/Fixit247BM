import { z } from 'zod';
import { normalizeAustralianPhone } from '@/lib/utils/phone';

// Strips common formatting characters, validates as an Australian number,
// and normalises the stored value to E.164 (+61XXXXXXXXX).
const auPhoneSchema = z
  .string()
  .transform((val) => val.replace(/[\s\-().]/g, ''))
  .pipe(z.string().regex(/^(\+?61|0)[2-9]\d{8}$/, 'Enter a valid Australian phone number'))
  .transform((val) => normalizeAustralianPhone(val) ?? val);

// ─── Customer ────────────────────────────────────────────────────────────────

export const customerOnboardingSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: auPhoneSchema,
  suburb: z.string().min(2, 'Enter your suburb'),
  postcode: z.string().regex(/^\d{4}$/, 'Enter a valid 4-digit postcode'),
  state: z.enum(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']),
  street: z.string().min(5, 'Enter your street address'),
  notifyBySms: z.boolean().default(true),
  notifyByEmail: z.boolean().default(true),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === '' || normalizeAustralianPhone(val) !== null,
      'Enter a valid Australian phone number',
    )
    .transform((val) => (val && val.trim() !== '' ? (normalizeAustralianPhone(val) ?? val) : val)),
});

export type CustomerOnboardingValues = z.infer<typeof customerOnboardingSchema>;

// ─── Tradie Step 1 — Business Details ────────────────────────────────────────

export const tradieBusinessSchema = z.object({
  businessName: z.string().min(2, 'Enter your business name').max(100),
  abn: z
    .string()
    .regex(/^\d{11}$/, 'ABN must be 11 digits (no spaces)')
    .optional()
    .or(z.literal('')),
  phone: auPhoneSchema,
  trades: z.array(z.string()).min(1, 'Select at least one trade'),
  serviceSuburbs: z.array(z.string()).min(1, 'Add at least one service suburb'),
  serviceRadiusKm: z.number().min(5).max(200).default(25),
  bio: z.string().max(1000).optional(),
});

// ─── Tradie Step 2 — Verification ────────────────────────────────────────────

export const tradieVerificationSchema = z.object({
  hasLicense: z.boolean(),
  licenceType: z.string().optional(),
  licenceNumber: z.string().optional(),
  licenceState: z.string().optional(),
  hasInsurance: z.boolean(),
  insurer: z.string().optional(),
  policyNumber: z.string().optional(),
  coverAmount: z.number().optional(),
});

// ─── Tradie Step 3 — Professional Profile ────────────────────────────────────

export const tradieProfileSchema = z.object({
  yearsExperience: z.number().min(0).max(60),
  hourlyRate: z.number().min(0).max(10000).optional(),
  calloutFee: z.number().min(0).max(5000).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuedBy: z.string(),
  })).optional(),
});

// ─── Tradie Step 4 — Availability ────────────────────────────────────────────

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const tradieAvailabilitySchema = z.object({
  isEmergencyAvailable: z.boolean().default(false),
  acceptsSameDay: z.boolean().default(false),
  emergencyResponseMinutes: z.number().min(15).max(240).default(60),
  emergencySurchargePercent: z.number().min(0).max(200).default(50),
  availability: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(timeRegex, 'Use HH:MM format'),
    endTime: z.string().regex(timeRegex, 'Use HH:MM format'),
    isAvailable: z.boolean(),
  })),
});

export type TradieBusinessValues = z.infer<typeof tradieBusinessSchema>;
export type TradieVerificationValues = z.infer<typeof tradieVerificationSchema>;
export type TradieProfileValues = z.infer<typeof tradieProfileSchema>;
export type TradieAvailabilityValues = z.infer<typeof tradieAvailabilitySchema>;
