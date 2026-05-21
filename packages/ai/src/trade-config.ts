// Australian trade market data — used for lead pricing and AI classification
// Based on ABS construction data, ServiceSeeking reports, and hipages market analysis (2024)

export interface TradePricingConfig {
  readonly category: string;
  readonly avgJobValueAud: number;
  readonly leadPriceBase: number;        // AUD, base lead price
  readonly emergencyMultiplier: number;  // multiplied for emergency jobs
  readonly complexityMultipliers: {
    readonly SIMPLE: number;             // <1 for discount
    readonly MEDIUM: number;             // 1.0 = base
    readonly COMPLEX: number;            // >1 for premium
  };
  readonly platformFeePercent: number;   // % of job value taken as platform fee
  readonly avgCompletionHours: number;
  readonly emergencyAvailable: boolean;
  readonly icon: string;
  readonly australianLicenceRequired: boolean;
  readonly commonEmergencies: readonly string[];
}

export const TRADE_PRICING: Record<string, TradePricingConfig> = {
  PLUMBING: {
    category: 'PLUMBING',
    avgJobValueAud: 550,
    leadPriceBase: 35,
    emergencyMultiplier: 2.0,
    complexityMultipliers: { SIMPLE: 0.6, MEDIUM: 1.0, COMPLEX: 1.8 },
    platformFeePercent: 7.5,
    avgCompletionHours: 2.5,
    emergencyAvailable: true,
    icon: '🔧',
    australianLicenceRequired: true,
    commonEmergencies: ['burst pipe', 'blocked drain', 'no hot water', 'gas leak', 'toilet overflow'],
  },
  ELECTRICAL: {
    category: 'ELECTRICAL',
    avgJobValueAud: 1800,
    leadPriceBase: 75,
    emergencyMultiplier: 1.8,
    complexityMultipliers: { SIMPLE: 0.5, MEDIUM: 1.0, COMPLEX: 1.7 },
    platformFeePercent: 6.0,
    avgCompletionHours: 3.0,
    emergencyAvailable: true,
    icon: '⚡',
    australianLicenceRequired: true,
    commonEmergencies: ['power outage', 'RCD tripping', 'sparking outlet', 'switchboard fault', 'no power'],
  },
  HVAC: {
    category: 'HVAC',
    avgJobValueAud: 900,
    leadPriceBase: 55,
    emergencyMultiplier: 1.8,
    complexityMultipliers: { SIMPLE: 0.6, MEDIUM: 1.0, COMPLEX: 1.6 },
    platformFeePercent: 7.0,
    avgCompletionHours: 3.0,
    emergencyAvailable: true,
    icon: '❄️',
    australianLicenceRequired: true,
    commonEmergencies: ['ac not cooling', 'heating failure', 'gas heater fault', 'refrigerant leak'],
  },
  GLAZING: {
    category: 'GLAZING',
    avgJobValueAud: 480,
    leadPriceBase: 25,
    emergencyMultiplier: 2.5,     // High — broken windows are a security emergency
    complexityMultipliers: { SIMPLE: 0.65, MEDIUM: 1.0, COMPLEX: 1.5 },
    platformFeePercent: 5.5,
    avgCompletionHours: 2.0,
    emergencyAvailable: true,
    icon: '🪟',
    australianLicenceRequired: false,
    commonEmergencies: ['broken window', 'smashed glass', 'door glass replacement', 'security breach'],
  },
  LOCKSMITH: {
    category: 'LOCKSMITH',
    avgJobValueAud: 200,
    leadPriceBase: 14,
    emergencyMultiplier: 2.8,     // Highest — lockouts are pure urgency
    complexityMultipliers: { SIMPLE: 0.7, MEDIUM: 1.0, COMPLEX: 1.4 },
    platformFeePercent: 8.0,
    avgCompletionHours: 1.0,
    emergencyAvailable: true,
    icon: '🔐',
    australianLicenceRequired: true,
    commonEmergencies: ['lockout', 'broken lock', 'lost keys', 'lock change', 'car lockout'],
  },
  CARPENTRY: {
    category: 'CARPENTRY',
    avgJobValueAud: 800,
    leadPriceBase: 45,
    emergencyMultiplier: 1.4,
    complexityMultipliers: { SIMPLE: 0.6, MEDIUM: 1.0, COMPLEX: 1.8 },
    platformFeePercent: 7.0,
    avgCompletionHours: 4.0,
    emergencyAvailable: false,
    icon: '🪚',
    australianLicenceRequired: false,
    commonEmergencies: ['door frame damage', 'structural repair'],
  },
  ROOFING: {
    category: 'ROOFING',
    avgJobValueAud: 3500,
    leadPriceBase: 140,
    emergencyMultiplier: 1.9,
    complexityMultipliers: { SIMPLE: 0.4, MEDIUM: 1.0, COMPLEX: 1.6 },
    platformFeePercent: 5.5,
    avgCompletionHours: 6.0,
    emergencyAvailable: true,
    icon: '🏠',
    australianLicenceRequired: true,
    commonEmergencies: ['roof leak', 'storm damage', 'fallen tree on roof'],
  },
  PAINTING: {
    category: 'PAINTING',
    avgJobValueAud: 2000,
    leadPriceBase: 90,
    emergencyMultiplier: 1.2,
    complexityMultipliers: { SIMPLE: 0.4, MEDIUM: 1.0, COMPLEX: 1.5 },
    platformFeePercent: 6.5,
    avgCompletionHours: 8.0,
    emergencyAvailable: false,
    icon: '🎨',
    australianLicenceRequired: false,
    commonEmergencies: [],
  },
  TILING: {
    category: 'TILING',
    avgJobValueAud: 1200,
    leadPriceBase: 65,
    emergencyMultiplier: 1.3,
    complexityMultipliers: { SIMPLE: 0.5, MEDIUM: 1.0, COMPLEX: 1.7 },
    platformFeePercent: 6.5,
    avgCompletionHours: 6.0,
    emergencyAvailable: false,
    icon: '⬜',
    australianLicenceRequired: false,
    commonEmergencies: [],
  },
  PEST_CONTROL: {
    category: 'PEST_CONTROL',
    avgJobValueAud: 350,
    leadPriceBase: 22,
    emergencyMultiplier: 1.6,
    complexityMultipliers: { SIMPLE: 0.7, MEDIUM: 1.0, COMPLEX: 1.4 },
    platformFeePercent: 7.5,
    avgCompletionHours: 2.0,
    emergencyAvailable: true,
    icon: '🐛',
    australianLicenceRequired: true,
    commonEmergencies: ['wasp nest', 'snake', 'severe infestation'],
  },
  PLASTERING: {
    category: 'PLASTERING',
    avgJobValueAud: 600,
    leadPriceBase: 35,
    emergencyMultiplier: 1.3,
    complexityMultipliers: { SIMPLE: 0.6, MEDIUM: 1.0, COMPLEX: 1.5 },
    platformFeePercent: 7.0,
    avgCompletionHours: 4.0,
    emergencyAvailable: false,
    icon: '🧱',
    australianLicenceRequired: false,
    commonEmergencies: [],
  },
  LANDSCAPING: {
    category: 'LANDSCAPING',
    avgJobValueAud: 1500,
    leadPriceBase: 70,
    emergencyMultiplier: 1.3,
    complexityMultipliers: { SIMPLE: 0.4, MEDIUM: 1.0, COMPLEX: 1.6 },
    platformFeePercent: 7.0,
    avgCompletionHours: 6.0,
    emergencyAvailable: false,
    icon: '🌿',
    australianLicenceRequired: false,
    commonEmergencies: ['fallen tree', 'storm debris'],
  },
  CLEANING: {
    category: 'CLEANING',
    avgJobValueAud: 220,
    leadPriceBase: 12,
    emergencyMultiplier: 1.5,
    complexityMultipliers: { SIMPLE: 0.7, MEDIUM: 1.0, COMPLEX: 1.3 },
    platformFeePercent: 9.0,
    avgCompletionHours: 3.0,
    emergencyAvailable: false,
    icon: '🧹',
    australianLicenceRequired: false,
    commonEmergencies: [],
  },
  APPLIANCE_REPAIR: {
    category: 'APPLIANCE_REPAIR',
    avgJobValueAud: 280,
    leadPriceBase: 18,
    emergencyMultiplier: 1.7,
    complexityMultipliers: { SIMPLE: 0.7, MEDIUM: 1.0, COMPLEX: 1.4 },
    platformFeePercent: 8.0,
    avgCompletionHours: 1.5,
    emergencyAvailable: true,
    icon: '🔌',
    australianLicenceRequired: false,
    commonEmergencies: ['fridge not cooling', 'washing machine flood', 'oven failure'],
  },
  GENERAL_MAINTENANCE: {
    category: 'GENERAL_MAINTENANCE',
    avgJobValueAud: 300,
    leadPriceBase: 18,
    emergencyMultiplier: 1.5,
    complexityMultipliers: { SIMPLE: 0.7, MEDIUM: 1.0, COMPLEX: 1.4 },
    platformFeePercent: 8.5,
    avgCompletionHours: 2.5,
    emergencyAvailable: false,
    icon: '🛠️',
    australianLicenceRequired: false,
    commonEmergencies: [],
  },
  OTHER: {
    category: 'OTHER',
    avgJobValueAud: 400,
    leadPriceBase: 20,
    emergencyMultiplier: 1.5,
    complexityMultipliers: { SIMPLE: 0.7, MEDIUM: 1.0, COMPLEX: 1.5 },
    platformFeePercent: 8.0,
    avgCompletionHours: 3.0,
    emergencyAvailable: false,
    icon: '🔨',
    australianLicenceRequired: false,
    commonEmergencies: [],
  },
};

export type JobComplexity = 'SIMPLE' | 'MEDIUM' | 'COMPLEX';

export interface LeadPriceResult {
  basePrice: number;
  finalPrice: number;
  emergencyPremium: number;
  complexityAdjustment: number;
  platformFeePercent: number;
  currency: 'AUD';
  breakdown: string;
}

export function calculateLeadPrice(
  category: string,
  complexity: JobComplexity,
  isEmergency: boolean
): LeadPriceResult {
  const fallback = TRADE_PRICING.OTHER as TradePricingConfig;
  const config = TRADE_PRICING[category] ?? fallback;
  const basePrice = config.leadPriceBase;
  const complexityMult = config.complexityMultipliers[complexity];
  const afterComplexity = basePrice * complexityMult;
  const emergencyPremium = isEmergency ? afterComplexity * (config.emergencyMultiplier - 1) : 0;
  const finalPrice = Math.ceil(afterComplexity + emergencyPremium);

  return {
    basePrice,
    finalPrice,
    emergencyPremium: Math.ceil(emergencyPremium),
    complexityAdjustment: Math.ceil(afterComplexity - basePrice),
    platformFeePercent: config.platformFeePercent,
    currency: 'AUD',
    breakdown: `Base $${String(basePrice)} × ${String(complexityMult)} complexity${isEmergency ? ` + $${String(Math.ceil(emergencyPremium))} emergency` : ''} = $${String(finalPrice)} AUD`,
  };
}

export function getTradeConfig(category: string): TradePricingConfig {
  return TRADE_PRICING[category] ?? (TRADE_PRICING.OTHER as TradePricingConfig);
}

export function getAllEmergencyTrades(): string[] {
  return Object.values(TRADE_PRICING)
    .filter((t) => t.emergencyAvailable)
    .map((t) => t.category);
}
