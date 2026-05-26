'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, Clock, ChevronRight, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@fixit247/ui';
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
  { id: 'EMERGENCY', label: 'Emergency', sublabel: 'Right now — within 1 hour', icon: '🚨', color: 'border-red-500/50 bg-red-500/10 text-red-400' },
  { id: 'URGENT', label: 'Same-day', sublabel: 'Today — within a few hours', icon: '⚡', color: 'border-orange-500/50 bg-orange-500/10 text-orange-400' },
  { id: 'STANDARD', label: 'Scheduled', sublabel: 'I can wait a day or two', icon: '📅', color: 'border-white/20 bg-white/6 text-gray-300' },
];

interface SavedAddress {
  id: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  isDefault: boolean;
}

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
  addressId?: string;
  addressSuburb?: string;
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
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [aiResult, setAiResult] = React.useState<AIScopeResult | null>(null);
  const [showAiScope, setShowAiScope] = React.useState(false);
  const [addresses, setAddresses] = React.useState<SavedAddress[]>([]);

  const [formData, setFormData] = React.useState<FormData>({
    category: '',
    description: '',
    priority: isEmergencyMode ? 'EMERGENCY' : 'STANDARD',
    mediaUrls: [],
    complexity: 'MEDIUM',
  });

  // Fetch the customer's saved address so we can send addressId with the job
  React.useEffect(() => {
    fetch('/api/customer/address')
      .then((r) => r.ok ? r.json() : null)
      .then((data: { address: { id: string; suburb: string } | null } | null) => {
        if (data?.address) {
          const { id, suburb } = data.address;
          setFormData((prev) => ({ ...prev, addressId: id, addressSuburb: suburb }));
        }
      })
      .catch(() => { /* non-fatal — job still posts without addressId */ });
  }, []);

  const updateForm = (updates: Partial<FormData>) => { setFormData((prev) => ({ ...prev, ...updates })); };

  // Load customer addresses when reaching step 3
  React.useEffect(() => {
    if (step !== 3 || addresses.length > 0) return;
    fetch('/api/customer/addresses')
      .then((r) => r.json())
      .then((json: { addresses?: SavedAddress[] }) => {
        const list = json.addresses ?? [];
        setAddresses(list);
        const def: SavedAddress | undefined = list.find((a) => a.isDefault) ?? list.at(0);
        if (def && !formData.addressId) updateForm({ addressId: def.id });
      })
      .catch(() => undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

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
        const { result } = await res.json() as { result: AIScopeResult };
        setAiResult(result);
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
    setSubmitError(null);
    try {
      const title = aiResult?.suggestedTitle ?? `${formData.category.replace(/_/g, ' ')} job`;
      const description = aiResult?.professionalSummary ?? formData.description;

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category:         formData.category,
          priority:         formData.priority,
          isEmergency:      formData.priority === 'EMERGENCY',
          budgetMin:        formData.budgetMin,
          budgetMax:        formData.budgetMax,
          addressId:        formData.addressId,
          mediaUrls:        formData.mediaUrls,
          voiceNoteUrl:     formData.voiceNoteUrl,
          preferredTime:    formData.preferredTime,
          complexity:       formData.complexity,
          aiUrgencyScore:   aiResult?.urgencyScore,
          aiConfidenceScore: aiResult?.confidenceScore,
          // leadPrice is intentionally omitted — computed server-side
        }),
      });

      if (res.ok) {
        const { job } = await res.json() as { job: { id: string } };
        router.push(`/jobs/${job.id}`);
        return;
      }

      const errData = await res.json().catch(() => ({})) as { error?: string };
      setSubmitError(errData.error ?? 'Something went wrong. Please try again.');
    } catch {
      setSubmitError('Network error — please check your connection and try again.');
    } finally {
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
            <h2 className="mb-1 text-2xl font-bold text-white">What do you need help with?</h2>
            <p className="mb-6 text-sm text-gray-500">Describe the problem in your own words — our AI will handle the rest.</p>

            <div className="space-y-4">
              <textarea
                value={formData.description}
                onChange={(e) => { updateForm({ description: e.target.value }); }}
                placeholder="e.g. My kitchen sink is leaking badly under the cabinet and water is coming through..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/15 bg-white/6 p-4 text-sm text-white placeholder-gray-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />

              <MediaUpload
                onImagesChange={(urls) => { updateForm({ mediaUrls: urls }); }}
                onVoiceTranscript={(text) => { updateForm({ description: formData.description ? `${formData.description}\n\n[Voice note]: ${text}` : text }); }}
              />

              <Button
                onClick={formData.description || formData.mediaUrls.length > 0 ? analyzeWithAI : () => { setStep(2); }}
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
            <h2 className="mb-1 text-2xl font-bold text-white">AI Scope Review</h2>
            <p className="mb-6 text-sm text-gray-500">Review what our AI found. You can edit anything before posting.</p>
            <AIScopeDisplay
              result={aiResult}
              onAccept={handleAcceptAiScope}
              onEdit={() => { setShowAiScope(false); }}
            />
          </motion.div>
        )}

        {/* Step 2: Category + urgency */}
        {step === 2 && !showAiScope && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="mb-1 text-2xl font-bold text-white">Trade & urgency</h2>
            <p className="mb-6 text-sm text-gray-500">Confirm the trade category and how urgently you need help.</p>

            <div className="space-y-6">
              {/* Category grid */}
              <div>
                <p className="mb-3 text-sm font-medium text-gray-400">Trade category</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TRADE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => { updateForm({ category: cat.id }); }}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-all',
                        formData.category === cat.id
                          ? 'border-brand-500 bg-brand-500/10 text-brand-400 ring-2 ring-brand-500/30'
                          : 'border-white/10 bg-white/4 text-gray-400 hover:border-brand-500/40 hover:bg-white/6'
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
                <p className="mb-3 text-sm font-medium text-gray-400">How urgent is this?</p>
                <div className="space-y-2">
                  {URGENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => { updateForm({ priority: opt.id }); }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                        formData.priority === opt.id ? opt.color + ' ring-2 ring-offset-1 ring-offset-[#111]' : 'border-white/10 bg-white/4 text-gray-400 hover:border-white/20'
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
                <Button variant="outline" onClick={() => { setStep(1); }} className="flex-1 gap-2">
                  <ChevronLeft size={16} />
                  Back
                </Button>
                <Button
                  onClick={() => { setStep(3); }}
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
            <h2 className="mb-1 text-2xl font-bold text-white">Location & budget</h2>
            <p className="mb-6 text-sm text-gray-500">Tell tradies where you are and your rough budget (optional).</p>

            <div className="space-y-5">
              {/* Address picker */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-400 flex items-center gap-2">
                  <MapPin size={14} className="text-brand-400" />
                  Job location
                </p>
                {addresses.length === 0 ? (
                  <div className="rounded-xl border border-white/8 bg-white/4 p-4 text-xs text-gray-500">
                    Loading your saved addresses…
                  </div>
                ) : (
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => { updateForm({ addressId: addr.id }); }}
                        className={cn(
                          'w-full flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all',
                          formData.addressId === addr.id
                            ? 'border-brand-500 bg-brand-500/10 text-white ring-2 ring-brand-500/30'
                            : 'border-white/10 bg-white/4 text-gray-400 hover:border-brand-500/40'
                        )}
                      >
                        <MapPin size={14} className="shrink-0 text-brand-400" />
                        <span className="flex-1 truncate">
                          {addr.street}, {addr.suburb} {addr.state} {addr.postcode}
                        </span>
                        {addr.isDefault && (
                          <span className="text-xs text-brand-400">Default</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-400">Budget range (optional)</p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.budgetMin ?? ''}
                      onChange={(e) => { updateForm({ budgetMin: e.target.value ? Number(e.target.value) : undefined }); }}
                      className="w-full rounded-xl border border-white/15 bg-white/6 py-3 pl-7 pr-3 text-sm text-white placeholder-gray-600 focus:border-brand-400 focus:outline-none"
                    />
                  </div>
                  <span className="text-gray-400">–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={formData.budgetMax ?? ''}
                      onChange={(e) => { updateForm({ budgetMax: e.target.value ? Number(e.target.value) : undefined }); }}
                      className="w-full rounded-xl border border-white/15 bg-white/6 py-3 pl-7 pr-3 text-sm text-white placeholder-gray-600 focus:border-brand-400 focus:outline-none"
                    />
                  </div>
                  <span className="text-xs text-gray-400">AUD</span>
                </div>
              </div>

              {/* Job summary */}
              <div className="rounded-xl border border-white/8 bg-white/4 p-4 space-y-2">
                <p className="text-sm font-semibold text-white">Job summary</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-base">{TRADE_CATEGORIES.find((c) => c.id === formData.category)?.icon}</span>
                  <span>{formData.category.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {formData.priority === 'EMERGENCY' ? <Zap size={14} className="text-red-500" /> : <Clock size={14} className="text-gray-400" />}
                  <span>{URGENCY_OPTIONS.find((o) => o.id === formData.priority)?.label}</span>
                </div>
                {formData.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{formData.description}</p>
                )}
              </div>

              {submitError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {submitError}
                </p>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setStep(2); }} className="flex-1 gap-2">
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
