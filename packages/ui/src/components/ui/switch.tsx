'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
  description?: string;
  size?: 'sm' | 'default';
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, description, size = 'default', id: externalId, ...props }, ref) => {
  const generatedId = React.useId();
  const id = externalId ?? generatedId;

  const trackClass = size === 'sm'
    ? 'h-5 w-9'
    : 'h-6 w-11';

  const thumbClass = size === 'sm'
    ? 'h-4 w-4 data-[state=checked]:translate-x-4'
    : 'h-5 w-5 data-[state=checked]:translate-x-5';

  const switchEl = (
    <SwitchPrimitive.Root
      ref={ref}
      id={id}
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=unchecked]:bg-gray-200',
        'data-[state=checked]:bg-brand-600',
        trackClass,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-md',
          'ring-0 transition-transform duration-200',
          'data-[state=unchecked]:translate-x-0',
          thumbClass,
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label) return switchEl;

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-0.5 flex-1">
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-900 cursor-pointer leading-none"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        )}
      </div>
      {switchEl}
    </div>
  );
});
Switch.displayName = 'Switch';

export { Switch };
