'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StepItem {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

type StepState = 'completed' | 'active' | 'upcoming';

function getStepState(index: number, currentStep: number): StepState {
  if (index < currentStep) return 'completed';
  if (index === currentStep) return 'active';
  return 'upcoming';
}

// ─── Step Indicator Circle ─────────────────────────────────────────────────

function StepCircle({
  state,
  index,
  icon,
}: {
  state: StepState;
  index: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Active animated ring */}
      {state === 'active' && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-brand-400"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      <motion.div
        className={cn(
          'relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold',
          'transition-colors duration-300',
          state === 'completed' && 'border-brand-600 bg-brand-600 text-white',
          state === 'active' && 'border-brand-600 bg-white text-brand-600',
          state === 'upcoming' && 'border-gray-300 bg-white text-gray-400',
        )}
        initial={false}
        animate={{ scale: state === 'active' ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          {state === 'completed' ? (
            <motion.span
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-4 w-4" strokeWidth={3} />
            </motion.span>
          ) : icon ? (
            <motion.span
              key="icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {icon}
            </motion.span>
          ) : (
            <motion.span
              key="number"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {index + 1}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Connector Line ────────────────────────────────────────────────────────

function ConnectorLine({
  completed,
  orientation,
}: {
  completed: boolean;
  orientation: 'horizontal' | 'vertical';
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-200',
        orientation === 'horizontal' ? 'flex-1 h-0.5' : 'w-0.5 flex-1 min-h-[2rem]',
      )}
    >
      <motion.div
        className="absolute inset-0 bg-brand-600 origin-left"
        initial={{ scaleX: 0, scaleY: 0 }}
        animate={completed ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
        style={{
          transformOrigin: orientation === 'horizontal' ? 'left center' : 'center top',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── Horizontal Stepper ────────────────────────────────────────────────────

function HorizontalStepper({ steps, currentStep }: StepperProps) {
  return (
    <>
      {/* Mobile: condensed text */}
      <div className="sm:hidden mb-4">
        <p className="text-sm font-medium text-gray-500">
          Step <span className="text-brand-600 font-semibold">{currentStep + 1}</span> of {steps.length}
        </p>
        <p className="text-base font-semibold text-gray-900 mt-0.5">
          {steps[currentStep]?.label}
        </p>
        {steps[currentStep]?.description && (
          <p className="text-sm text-gray-500 mt-0.5">{steps[currentStep].description}</p>
        )}
      </div>

      {/* Desktop: full stepper */}
      <div className="hidden sm:flex items-start">
        {steps.map((step, index) => {
          const state = getStepState(index, currentStep);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-2 min-w-0">
                <StepCircle state={state} index={index} icon={step.icon} />
                <div className="text-center px-1">
                  <p
                    className={cn(
                      'text-xs font-semibold leading-tight',
                      state === 'active' ? 'text-brand-600' : state === 'completed' ? 'text-gray-900' : 'text-gray-400',
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{step.description}</p>
                  )}
                </div>
              </div>
              {!isLast && (
                <div className="flex-1 mt-4 mx-2">
                  <ConnectorLine completed={index < currentStep} orientation="horizontal" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}

// ─── Vertical Stepper ─────────────────────────────────────────────────────

function VerticalStepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex flex-col">
      {/* Mobile condensed */}
      <div className="sm:hidden mb-4">
        <p className="text-sm font-medium text-gray-500">
          Step <span className="text-brand-600 font-semibold">{currentStep + 1}</span> of {steps.length}
        </p>
      </div>

      {steps.map((step, index) => {
        const state = getStepState(index, currentStep);
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex gap-4">
            {/* Left column: circle + line */}
            <div className="flex flex-col items-center">
              <StepCircle state={state} index={index} icon={step.icon} />
              {!isLast && (
                <div className="flex-1 my-1 w-0.5">
                  <ConnectorLine completed={index < currentStep} orientation="vertical" />
                </div>
              )}
            </div>

            {/* Right column: label + description */}
            <div className={cn('pb-6', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-semibold mt-1.5',
                  state === 'active' ? 'text-brand-600' : state === 'completed' ? 'text-gray-900' : 'text-gray-400',
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────

export function Stepper({ steps, currentStep, variant = 'horizontal', className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      {variant === 'horizontal' ? (
        <HorizontalStepper steps={steps} currentStep={currentStep} variant="horizontal" />
      ) : (
        <VerticalStepper steps={steps} currentStep={currentStep} variant="vertical" />
      )}
    </div>
  );
}
