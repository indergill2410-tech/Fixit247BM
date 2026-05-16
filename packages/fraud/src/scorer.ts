import type { FraudSignal } from './signals';

export interface FraudRiskResult {
  riskScore: number; // 0–100
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  signals: FraudSignal[];
  recommendation: 'CLEAR' | 'MONITOR' | 'FLAG' | 'SUSPEND';
}

export function calculateFraudRisk(signals: FraudSignal[]): FraudRiskResult {
  if (signals.length === 0) {
    return { riskScore: 0, severity: 'LOW', signals: [], recommendation: 'CLEAR' };
  }

  // Take max contribution + 50% of remaining signals (diminishing returns)
  const sorted = [...signals].sort((a, b) => b.riskContribution - a.riskContribution);
  const riskScore = Math.min(
    100,
    sorted.reduce((acc, s, i) => acc + s.riskContribution * Math.pow(0.5, i), 0)
  );

  const rounded = Math.round(riskScore);
  const hasCritical = signals.some((s) => s.severity === 'CRITICAL');
  const hasHigh = signals.some((s) => s.severity === 'HIGH');

  const severity = hasCritical || rounded >= 80 ? 'CRITICAL'
    : hasHigh || rounded >= 55 ? 'HIGH'
    : rounded >= 30 ? 'MEDIUM'
    : 'LOW';

  const recommendation = rounded >= 75 ? 'SUSPEND'
    : rounded >= 50 ? 'FLAG'
    : rounded >= 25 ? 'MONITOR'
    : 'CLEAR';

  return { riskScore: rounded, severity, signals, recommendation };
}
