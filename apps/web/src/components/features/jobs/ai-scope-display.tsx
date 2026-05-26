'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@fixit247/ui';
import { cn } from '@fixit247/ui/src/lib/utils';

interface AIScopeResult {
  suggestedTitle: string;
  professionalSummary: string;
  category: string;
  complexity: 'SIMPLE' | 'MEDIUM' | 'COMPLEX';
  urgencyScore: number;
  confidenceScore: number;
  isEmergency: boolean;
  emergencyIndicators: string[];
  suggestedMaterials: string[];
  estimatedPriceMin: number | null;
  estimatedPriceMax: number | null;
  estimatedHours: number | null;
  safetyRisk: boolean;
  safetyNotes: string | null;
  preferredTimeframe: string;
}

interface AIScopeDisplayProps {
  result: AIScopeResult;
  onAccept: (result: AIScopeResult) => void;
  onEdit: () => void;
  className?: string;
}

const URGENCY_COLORS = [
  { min: 0, max: 30, color: 'bg-green-500', label: 'Standard' },
  { min: 30, max: 60, color: 'bg-yellow-500', label: 'Priority' },
  { min: 60, max: 80, color: 'bg-orange-500', label: 'Urgent' },
  { min: 80, max: 101, color: 'bg-red-500', label: 'Emergency' },
];

const CATEGORY_ICONS: Record<string, string> = {
  PLUMBING: '🔧', ELECTRICAL: '⚡', HVAC: '❄️', CARPENTRY: '🪚', PAINTING: '🎨',
  ROOFING: '🏠', TILING: '⬜', PEST_CONTROL: '🐛', LOCKSMITH: '🔐', GLAZING: '🪟',
  PLASTERING: '🧱', LANDSCAPING: '🌿', CLEANING: '🧹', APPLIANCE_REPAIR: '🔌',
  GENERAL_MAINTENANCE: '🛠️', OTHER: '🔨',
};

export function AIScopeDisplay({ result, onAccept, onEdit, className }: AIScopeDisplayProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  const urgencyConfig = URGENCY_COLORS.find(
    (c) => result.urgencyScore >= c.min && result.urgencyScore < c.max
  ) ?? URGENCY_COLORS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5', className)}
    >
      {/* AI header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-700">AI Scope Analysis</p>
          <p className="text-xs text-brand-500">{result.confidenceScore}% confidence</p>
        </div>
        <div className="ml-auto">
          <Badge variant={result.isEmergency ? 'emergency' : 'default'}>
            {result.isEmergency ? '🚨 EMERGENCY' : urgencyConfig.label}
          </Badge>
        </div>
      </div>

      {/* Safety warning */}
      {result.safetyRisk && result.safetyNotes && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 border border-red-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-xs text-red-700">{result.safetyNotes}</p>
        </div>
      )}

      {/* Category + title */}
      <div className="mb-3 flex items-start gap-3">
        <span className="text-2xl">{CATEGORY_ICONS[result.category] ?? '🔨'}</span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">{result.suggestedTitle}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {result.category.replace(/_/g, ' ')} · {result.complexity} complexity
          </p>
        </div>
      </div>

      {/* Professional summary */}
      <p className="mb-4 text-sm text-gray-700 leading-relaxed">{result.professionalSummary}</p>

      {/* Urgency bar */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>Urgency</span>
          <span className="font-medium">{result.urgencyScore}/100</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.urgencyScore}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn('h-full rounded-full', urgencyConfig.color)}
          />
        </div>
      </div>

      {/* Price estimate */}
      {(result.estimatedPriceMin != null || result.estimatedPriceMax != null) && (
        <div className="mb-4 rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Estimated cost range</p>
          <p className="text-lg font-bold text-gray-900">
            {result.estimatedPriceMin != null && result.estimatedPriceMax != null
              ? `$${result.estimatedPriceMin.toLocaleString()} – $${result.estimatedPriceMax.toLocaleString()} AUD`
              : result.estimatedPriceMin != null
              ? `From $${result.estimatedPriceMin.toLocaleString()} AUD`
              : `Up to $${(result.estimatedPriceMax ?? 0).toLocaleString()} AUD`}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">AI estimate only — actual quote from tradie</p>
        </div>
      )}

      {/* Expandable details */}
      <button
        type="button"
        onClick={() => { setShowDetails(!showDetails); }}
        className="mb-4 flex w-full items-center justify-between text-xs text-gray-500 hover:text-gray-700"
      >
        <span>More details</span>
        {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 space-y-2 overflow-hidden"
        >
          {result.emergencyIndicators.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-red-600">Emergency signals detected:</p>
              <div className="flex flex-wrap gap-1">
                {result.emergencyIndicators.map((ind) => (
                  <span key={ind} className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">{ind}</span>
                ))}
              </div>
            </div>
          )}
          {result.suggestedMaterials.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-gray-600">Likely materials needed:</p>
              <div className="flex flex-wrap gap-1">
                {result.suggestedMaterials.map((m) => (
                  <span key={m} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{m}</span>
                ))}
              </div>
            </div>
          )}
          {result.estimatedHours && (
            <p className="text-xs text-gray-500">
              Estimated time: <span className="font-medium">{result.estimatedHours}h</span>
            </p>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Edit details
        </button>
        <button
          type="button"
          onClick={() => { onAccept(result); }}
          className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          <CheckCircle size={14} className="mr-1.5 inline" />
          Looks right — post job
        </button>
      </div>
    </motion.div>
  );
}
