export interface EmergencySignal {
  keyword: string;
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'LIFE_THREATENING';
  baseScore: number;
  safetyInstructions: string[];
}

export const EMERGENCY_SIGNALS: EmergencySignal[] = [
  // LIFE_THREATENING
  { keyword: 'gas leak', category: 'GAS', riskLevel: 'LIFE_THREATENING', baseScore: 100, safetyInstructions: ['Leave the building immediately', 'Do not turn any switches on or off', 'Call 000 if you smell strong gas', 'Wait outside until emergency services clear it'] },
  { keyword: 'smell gas', category: 'GAS', riskLevel: 'LIFE_THREATENING', baseScore: 100, safetyInstructions: ['Leave the building immediately', 'Do not turn any switches on or off', 'Call 000 immediately', 'Do not re-enter until cleared'] },
  { keyword: 'fire', category: 'FIRE', riskLevel: 'LIFE_THREATENING', baseScore: 100, safetyInstructions: ['Call 000 immediately', 'Evacuate everyone from the building', 'Do not attempt to fight the fire yourself', 'Wait for fire services outside'] },
  { keyword: 'electrocution', category: 'ELECTRICAL', riskLevel: 'LIFE_THREATENING', baseScore: 95, safetyInstructions: ['Do not touch the person', 'Turn off the power at the main switch', 'Call 000 immediately', 'Stay back at least 8 metres'] },
  { keyword: 'sparking', category: 'ELECTRICAL', riskLevel: 'CRITICAL', baseScore: 85, safetyInstructions: ['Turn off power at the main switchboard', 'Do not touch the outlet', 'Keep children and pets away', 'Do not use water near electrical faults'] },
  // CRITICAL
  { keyword: 'flooding', category: 'PLUMBING', riskLevel: 'CRITICAL', baseScore: 85, safetyInstructions: ['Turn off the main water supply', 'Move valuables to higher ground', 'Document damage with photos', 'Turn off electricity in affected areas'] },
  { keyword: 'burst pipe', category: 'PLUMBING', riskLevel: 'CRITICAL', baseScore: 80, safetyInstructions: ['Turn off the main water valve immediately', 'Open cold taps to drain remaining water', 'Turn off hot water system', 'Document damage with photos'] },
  { keyword: 'roof collapse', category: 'ROOFING', riskLevel: 'CRITICAL', baseScore: 90, safetyInstructions: ['Evacuate the affected area immediately', 'Do not re-enter until inspected', 'Call emergency services if anyone is trapped', 'Document damage from a safe distance'] },
  { keyword: 'no power', category: 'ELECTRICAL', riskLevel: 'HIGH', baseScore: 70, safetyInstructions: ['Check if neighbours are affected', 'Check your circuit breaker', 'Do not reset breakers that immediately trip again', 'Keep fridge and freezer closed'] },
  { keyword: 'power out', category: 'ELECTRICAL', riskLevel: 'HIGH', baseScore: 70, safetyInstructions: ['Check your main switchboard', 'Call your energy provider if outage is widespread', 'Use torches, not candles', 'Unplug sensitive electronics'] },
  // HIGH
  { keyword: 'locked out', category: 'LOCKSMITH', riskLevel: 'HIGH', baseScore: 65, safetyInstructions: ['Stay in a safe public place', 'Do not attempt to force entry', 'Keep your phone charged', 'Let someone know your situation'] },
  { keyword: 'water leak', category: 'PLUMBING', riskLevel: 'HIGH', baseScore: 60, safetyInstructions: ['Turn off water supply to the affected area', 'Place buckets to catch water', 'Protect flooring with towels', 'Document damage with photos'] },
  { keyword: 'leaking', category: 'PLUMBING', riskLevel: 'HIGH', baseScore: 55, safetyInstructions: ['Locate and turn off the nearest water shutoff', 'Remove valuables from the area', 'Photograph the damage'] },
  { keyword: 'overflowing', category: 'PLUMBING', riskLevel: 'HIGH', baseScore: 60, safetyInstructions: ['Turn off water supply', 'Use towels to contain water', 'Do not use the fixture until repaired'] },
  // MEDIUM
  { keyword: 'blocked drain', category: 'PLUMBING', riskLevel: 'MEDIUM', baseScore: 40, safetyInstructions: ['Do not use chemical drain cleaners', 'Avoid using affected drain until cleared'] },
  { keyword: 'hot water', category: 'PLUMBING', riskLevel: 'MEDIUM', baseScore: 45, safetyInstructions: ['Check the pilot light if gas hot water', 'Check the circuit breaker for electric hot water'] },
  { keyword: 'broken window', category: 'GLAZING', riskLevel: 'MEDIUM', baseScore: 50, safetyInstructions: ['Keep children and pets away from broken glass', 'Cover the opening with cardboard or plastic', 'Do not attempt to remove glass shards yourself'] },
  { keyword: 'ac not working', category: 'HVAC', riskLevel: 'LOW', baseScore: 25, safetyInstructions: ['Check the power supply and circuit breaker', 'Ensure filter is not blocked'] },
  { keyword: 'air conditioning', category: 'HVAC', riskLevel: 'LOW', baseScore: 20, safetyInstructions: ['Check thermostat settings', 'Check filter condition'] },
];

export interface EmergencyDetectionResult {
  isEmergency: boolean;
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'LIFE_THREATENING';
  emergencyScore: number;
  detectedSignals: EmergencySignal[];
  tradeCategory: string | null;
  recommendedAction: string;
  safetyInstructions: string[];
  autoDispatch: boolean;
  requiresAdminAlert: boolean;
}

export function detectEmergency(text: string): EmergencyDetectionResult {
  const lower = text.toLowerCase();
  const detected: EmergencySignal[] = [];

  for (const signal of EMERGENCY_SIGNALS) {
    if (lower.includes(signal.keyword)) {
      detected.push(signal);
    }
  }

  if (detected.length === 0) {
    return {
      isEmergency: false,
      riskLevel: 'SAFE',
      emergencyScore: 0,
      detectedSignals: [],
      tradeCategory: null,
      recommendedAction: 'Proceed with standard booking flow',
      safetyInstructions: [],
      autoDispatch: false,
      requiresAdminAlert: false,
    };
  }

  // Take highest score + diminishing returns for additional signals
  const sorted = [...detected].sort((a, b) => b.baseScore - a.baseScore);
  let score = sorted[0].baseScore;
  for (let i = 1; i < sorted.length; i++) {
    score = Math.min(100, score + sorted[i].baseScore * 0.2);
  }
  score = Math.round(score);

  const tradeCategory = sorted[0].category;

  const riskOrder = ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'LIFE_THREATENING'];
  const riskLevel = riskOrder[Math.max(...sorted.map((s) => riskOrder.indexOf(s.riskLevel)))] as EmergencyDetectionResult['riskLevel'];

  const allInstructions = [...new Set(sorted.flatMap((s) => s.safetyInstructions))].slice(0, 5);

  let recommendedAction: string;
  if (score >= 90) recommendedAction = 'IMMEDIATE DISPATCH — Life-threatening emergency. Alert admin and auto-dispatch nearest available tradie.';
  else if (score >= 70) recommendedAction = 'URGENT DISPATCH — Critical emergency. Priority dispatch within 30 minutes.';
  else if (score >= 50) recommendedAction = 'PRIORITY BOOKING — High urgency. Dispatch within 60 minutes.';
  else if (score >= 30) recommendedAction = 'STANDARD EMERGENCY — Book same-day service with urgent priority.';
  else recommendedAction = 'STANDARD BOOKING — Non-emergency. Book at customer\'s convenience.';

  return {
    isEmergency: score >= 50,
    riskLevel,
    emergencyScore: score,
    detectedSignals: sorted,
    tradeCategory,
    recommendedAction,
    safetyInstructions: allInstructions,
    autoDispatch: score >= 70,
    requiresAdminAlert: score >= 85,
  };
}
