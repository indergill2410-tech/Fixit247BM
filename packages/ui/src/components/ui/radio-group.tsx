'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '../../lib/utils';

// ─── Standard Radio Group ──────────────────────────────────────────────────

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('grid gap-2', className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-4 w-4 rounded-full border border-gray-300 text-brand-600',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="block h-1.5 w-1.5 rounded-full bg-white" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// ─── Card-Style Radio Group ────────────────────────────────────────────────

export interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

interface RadioCardGroupProps {
  options: RadioCardOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  className?: string;
  columns?: 1 | 2 | 3;
}

function RadioCardGroup({
  options,
  value,
  onValueChange,
  name,
  className,
  columns = 1,
}: RadioCardGroupProps) {
  const colClass: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      name={name}
      className={cn('grid gap-3', colClass[columns], className)}
    >
      {options.map((option) => (
        <RadioCardItem key={option.value} option={option} />
      ))}
    </RadioGroupPrimitive.Root>
  );
}

interface RadioCardItemProps {
  option: RadioCardOption;
}

function RadioCardItem({ option }: RadioCardItemProps) {
  return (
    <RadioGroupPrimitive.Item
      value={option.value}
      disabled={option.disabled}
      className={cn(
        'group relative flex items-start gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4',
        'text-left cursor-pointer transition-all duration-150',
        'hover:border-brand-300 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'data-[state=checked]:border-brand-600 data-[state=checked]:bg-blue-50/40 data-[state=checked]:shadow-sm',
        'disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      {/* Custom dot indicator */}
      <span
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
          'border-gray-300 transition-colors',
          'group-data-[state=checked]:border-brand-600 group-data-[state=checked]:bg-brand-600',
        )}
      >
        <RadioGroupPrimitive.Indicator>
          <span className="block h-1.5 w-1.5 rounded-full bg-white" />
        </RadioGroupPrimitive.Indicator>
      </span>

      <div className="flex flex-1 items-start gap-3">
        {option.icon && (
          <div className="shrink-0 text-gray-500 group-data-[state=checked]:text-brand-600 transition-colors mt-0.5">
            {option.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{option.label}</span>
            {option.badge && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-brand-700 text-xs font-medium">
                {option.badge}
              </span>
            )}
          </div>
          {option.description && (
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{option.description}</p>
          )}
        </div>
      </div>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, RadioCardGroup, RadioCardItem };
