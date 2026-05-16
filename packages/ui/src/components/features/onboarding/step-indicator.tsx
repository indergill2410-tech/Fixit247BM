'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface OnboardingStep {
  number?: number;
  label: string;
  description?: string;
}

export interface StepIndicatorProps {
  steps: OnboardingStep[];
  currentStep: number; // 0-indexed
  className?: string;
}

type StepState = 'completed' | 'active' | 'upcoming';

function getState(index: number, current: number): StepState {
  if (index < current) return 'completed';
  if (index === current) return 'active';
  return 'upcoming';
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  const total = steps.length;

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile view: compact indicator */}
      <div className="flex sm:hidden flex-col gap-1 mb-5">
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className={cn('h-1 flex-1 rounded-full')}
              animate={{
                backgroundColor:
                  i < currentStep
                    ? '#2563eb'
                    : i === currentStep
                    ? '#93c5fd'
                    : '#e5e7eb',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Step{' '}
          <span className="font-semibold text-brand-600">{currentStep + 1}</span> of {total}
          {steps[currentStep] && (
            <>
              {' — '}
              <span className="text-gray-700 font-medium">{steps[currentStep].label}</span>
            </>
          )}
        </p>
      </div>

      {/* Desktop view: full numbered steps */}
      <div className="hidden sm:flex items-start">
        {steps.map((step, index) => {
          const state = getState(index, currentStep);
          const isLast = index === total - 1;
          const num = step.number ?? index + 1;

          return (
            <React.Fragment key={index}>
              {/* Step node */}
              <div className="flex flex-col items-center gap-2 relative">
                {/* Circle */}
                <div className="relative flex items-center justify-center">
                  {state === 'active' && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-brand-400"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <motion.div
                    className={cn(
                      'relative z-10 flex h-10 w-10 items-center justify-center rounded-full',
                      'border-2 text-sm font-bold transition-colors duration-300',
                      state === 'completed' && 'border-brand-600 bg-brand-600 text-white',
                      state === 'active' && 'border-brand-600 bg-white text-brand-600',
                      state === 'upcoming' && 'border-gray-300 bg-white text-gray-400',
                    )}
                    animate={{ scale: state === 'active' ? 1.08 : 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  >
                    <AnimatePresence mode="wait">
                      {state === 'completed' ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                        >
                          <Check className="h-5 w-5" strokeWidth={3} />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="num"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18 }}
                        >
                          {num}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Label + description */}
                <div className="text-center max-w-[100px] px-1">
                  <motion.p
                    className={cn(
                      'text-xs font-semibold leading-snug',
                      state === 'active' && 'text-brand-600',
                      state === 'completed' && 'text-gray-800',
                      state === 'upcoming' && 'text-gray-400',
                    )}
                    animate={{ opacity: state === 'upcoming' ? 0.6 : 1 }}
                  >
                    {step.label}
                  </motion.p>
                  {step.description && (
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex-1 mt-5 mx-1.5 h-0.5 relative overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-brand-600 rounded-full"
                    animate={{ width: index < currentStep ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
