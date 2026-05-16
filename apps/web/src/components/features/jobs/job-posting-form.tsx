'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, Clock, ChevronRight, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { Button, Badge } from '@fixit247/ui';
import { cn } from '@fixit247/ui/src/lib/utils';
import { MediaUpload } from './media-upload';
import { AIScopeDisplay } from './ai-scope-display';

const TRADE_CATEGORIES = [
  { id: 'PLUMBING', label: 'Plumbing', icon: '🔧', emergency: true },
  { id: 'ELECTRICAL', label: 'Electrical', icon: '⚡', emergency: true },
  { id: 'HVAC', label: 'Heating & Cooling', icon: '❄️', emergency: true },
  { id: 'LOCKSMITH', label: 'Locksmith', icon: '🔐', emergency: true },
  { id: 'GLAZING', label: 'Glass & Windows', icon: '🪟', emergency: true },
  { id: 'ROOFING', label: 'Roofing', icon: '🏠', emergency: true },
  { id: 'CARPENTRY', label: 'Carpentry', icon: '🪚', emergency: false },
  { id: 'PAINTING', label: 'Painting', icon: '🎨', emergency: false },
  { id: 'TILING', label: 'Tiling', icon: '⬜', emergency: false },
  { id: 'PEST_CONTROL', label: 'Pest Control', icon: '🐛', emergency: true },
  { id: 'PLASTERING', label: 'Plastering', icon: '🧱', emergency: false },
  { id: 'LANDSCAPING', label: 'Landscaping', icon: '🌿', emergency: false },
  { id: 'CLEANING', label: 'Cleaning', icon: '🧹', emergency: false },
  { id: 'APPLIANCE_REPAIR', label: 'Appliance Repair', icon: '🔌', emergency: true },
  { id: 'GENERAL_MAINTENANCE', label: 'General Maintenance', icon: '🛠️', emergency: false },
  { id: 'OTHER', label: 'Other', icon: '🔨', emergency: false },
];

const URGENCY_OPTIONS = [
  { id: 'EMERGENCY', label: 'Emergency', sublabel: 'Right now — within 1 hour', icon: '🚨', color: 'border-red-400 bg-red-50 text-red-700' },
  { id: 'URGENT', label: 'Same-day', sublabel: 'Today — within a few hours', icon: '⚡', color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { id: 'STANDARD', label: 'Scheduled', sublabel: 'I can wait a day or two', icon: '📅', color: 'border-gray-300 bg-white text-gray-700' },
];

interface FormData {
  category: string;
  description: string;
  priority: string;
  budgetMin?: number;
  budgetMax?: number;
  mediaUrls: string[];
  voiceNoteUrl?: string;
  preferredTime?: string;
  complexity: 'SIMPLE' | 'MEDIUM' | 'COMPLEX';
}

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

export function JobPostingForm({ isEmergencyMode = false }: { isEmergencyMode?: boolean }) {
  const router = useRouter();
  const [step, setStep] = React.useState(isEmergencyMode ? 0 : 1);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [aiResult, setAiResult] = React.useState<AIScopeResult | null>(null);
  const [showAiScope, setShowAiScope] = React.useState(false);

  const [formData, setFormData] = React.useState<FormData>({
    category: isEmergencyMode ? '' : '',
    description: '',
    priority: isEmergencyMode ? 'EMERGENCY' : 'STANDARD',
    mediaUrls: [],
    complexity: 'MEDIUM',
  });

  const updateForm = (updates: Partial<FormData>) => setFormData((prev) => ({ ...prev, ...updates }));

  const analyzeWithAI = async () => {
    if (!formData.description && formData.mediaUrls.length === 0) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textDescription: formData.description,
          imageUrls: formData.mediaUrls,
        }),
      });
      if (res.ok) {
        const { result } = await res.json();
        setAiResult(result as AIScopeResult);
        setShowAiScope(true);
        // Auto-apply AI suggestions
        updateForm({
          category: result.category,
          priority: result.isEmergency ? 'EMERGENCY' : result.urgencyScore > 60 ? 'URGENT' : 'STANDARD',
          complexity: result.complexity,
        });
      }
    } catch {
      // Continue without AI
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptAiScope = (result: AIScopeResult) => {
    setShowAiScope(false);
    setStep(2);
    updateForm({
      category: result.category,
      priority: result.isEmergency ? 'EMERGENCY' : result.urgencyScore > 60 ? 'URGENT' : 'STANDARD',
      complexity: result.complexity,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const title = aiResult?.suggestedTitle ?? `${formData.category.replace(/_/g, ' ')} job`;
      const description = aiResult?.professionalSummary ?? formData.description;

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category: formData.category,
          priority: formData.priority,
          isEmergency: formData.priority === 'EMERGENCY',
          budgetMin: formData.budgetMin,
          budgetMax: formData.budgetMax,
          mediaUrls: formData.mediaUrls,
          voiceNoteUrl: formData.voiceNoteUrl,
          preferredTime: formData.preferredTime,
          complexity: formData.complexity,
          aiUrgencyScore: aiResult?.urgencyScore,
          aiConfidenceScore: aiResult?.confidenceScore,
          leadPrice: aiResult?.estimatedPriceMin
            ? Math.ceil(aiResult.estimatedPriceMin * 0.07)
            : undefined,
        }),
      });

      if (res.ok) {
        const { job } = await res.json();
        router.push(`/jobs/${job.id}`);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      {!showAiScope && (
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all',
                step >= s ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
              )}>
                {s}
              </div>
              {s < 3 && <div className={cn('h-0.5 w-12', step > s ? 'bg-brand-600' : 'bg-gray-200')} />}
            </React.Fragment>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Describe the problem */}
        {step === 1 && !showAiScope && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="mb-1 text-xl font-bold text-gray-900">What do you need help with?</h2>
            <p className="mb-6 text-sm text-gray-500">Describe the problem in your own words — our AI will handle the rest.</p>

            <div className="space-y-4">
              <textarea
                value={formData.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="e.g. My kitchen sink is leaking badly under the cabinet and water is coming through..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-4 text-sm placeholder-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />

              <MediaUpload
                onImagesChange={(urls) => updateForm({ mediaUrls: urls })}
                onVoiceTranscript={(text) => updateForm({ description: formData.description ? `${formData.description}\n\n[Voice note]: ${text}` : text })}
              />

              <Button
                onClick={formData.description || formData.mediaUrls.length > 0 ? analyzeWithAI : () => setStep(2)}
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    AI is analysing your job…
                  </>
                ) : formData.description || formData.mediaUrls.length > 0 ? (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Analyse with AI
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* AI scope review */}
        {showAiScope && aiResult && (
          <motion.div key="ai-scope" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <h2 className="mb-1 text-xl font-bold text-gray-900">AI Scope Review</h2>
            <p className="mb-6 text-sm text-gray-500">Review what our AI found. You can edit anything before posting.</p>
            <AIScopeDisplay
              result={aiResult}
              onAccept={handleAcceptAiScope}
              onEdit={() => setShowAiScope(false)}
            />
          </motion.div>
        )}

        {/* Step 2: Category + urgency */}
        {step === 2 && !showAiScope && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="mb-1 text-xl font-bold text-gray-900">Trade & urgency</h2>
            <p className="mb-6 text-sm text-gray-500">Confirm the trade category and how urgently you need help.</p>

            <div className="space-y-6">
              {/* Category grid */}
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">Trade category</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TRADE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateForm({ category: cat.id })}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-all',
                        formData.category === cat.id
                          ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-200'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-gray-50'
                      )}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-medium leading-tight">{cat.label}</span>
                      {cat.emergency && <span className="ml-auto text-xs text-red-500">24/7</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">How urgent is this?</p>
                <div className="space-y-2">
                  {URGENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateForm({ priority: opt.id })}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                        formData.priority === opt.id ? opt.color + ' ring-2 ring-offset-1' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      )}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <p className="font-semibold">{opt.label}</p>
                        <p className="text-xs opacity-75">{opt.sublabel}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 gap-2">
                  <ChevronLeft size={16} />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.category || !formData.priority}
                  className="flex-1 gap-2"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Location + budget + confirm */}
        {step === 3 && !showAiScope && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="mb-1 text-xl font-bold text-gray-900">Location & budget</h2>
            <p className="mb-6 text-sm text-gray-500">Tell tradies where you are and your rough budget (optional).</p>

            <div className="space-y-5">
              {/* Location (from profile — just show suburb) */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <MapPin size={18} className="text-brand-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">Your location</p>
                  <p className="text-xs text-gray-500">Using your saved address — change in profile</p>
                </div>
              </div>

              {/* Budget */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Budget range (optional)</p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.budgetMin ?? ''}
                      onChange={(e) => updateForm({ budgetMin: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-7 pr-3 text-sm focus:border-brand-400 focus:outline-none"
                    />
                  </div>
                  <span className="text-gray-400">–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={formData.budgetMax ?? ''}
                      onChange={(e) => updateForm({ budgetMax: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-7 pr-3 text-sm focus:border-brand-400 focus:outline-none"
                    />
                  </div>
                  <span className="text-xs text-gray-400">AUD</span>
                </div>
              </div>

              {/* Job summary */}
              <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-900">Job summary</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-base">{TRADE_CATEGORIES.find((c) => c.id === formData.category)?.icon}</span>
                  <span>{formData.category.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {formData.priority === 'EMERGENCY' ? <Zap size={14} className="text-red-500" /> : <Clock size={14} className="text-gray-400" />}
                  <span>{URGENCY_OPTIONS.find((o) => o.id === formData.priority)?.label}</span>
                </div>
                {formData.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{formData.description}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 gap-2">
                  <ChevronLeft size={16} />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.category}
                  className={cn('flex-1 gap-2', formData.priority === 'EMERGENCY' && 'bg-red-600 hover:bg-red-700')}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Posting…
                    </>
                  ) : formData.priority === 'EMERGENCY' ? (
                    <>
                      <Zap size={16} />
                      Get Help Now
                    </>
                  ) : (
                    <>
                      Post Job
                      <ChevronRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
