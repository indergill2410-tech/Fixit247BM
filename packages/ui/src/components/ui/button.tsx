'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default:
          'bg-brand-500 text-gray-900 hover:bg-brand-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]',
        destructive:
          'bg-red-600 text-white hover:bg-red-500 shadow-sm',
        outline:
          'border border-white/12 bg-transparent text-white hover:border-white/20 hover:bg-white/[0.04]',
        secondary:
          'bg-white/[0.06] text-white hover:bg-white/[0.10] border border-white/[0.07]',
        ghost:
          'text-gray-400 hover:bg-white/[0.05] hover:text-white',
        link:
          'text-brand-400 underline-offset-4 hover:underline p-0 h-auto font-medium',
        emergency:
          'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_24px_rgba(239,68,68,0.25)] hover:shadow-[0_0_40px_rgba(239,68,68,0.35)]',
        brand:
          'bg-brand-500 text-gray-900 hover:bg-brand-400 font-extrabold',
      },
      size: {
        sm: 'h-8 px-3.5 text-xs rounded-lg',
        default: 'h-10 px-5 py-2',
        lg: 'h-12 px-7 text-base rounded-xl',
        xl: 'h-14 px-9 text-base rounded-2xl',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
