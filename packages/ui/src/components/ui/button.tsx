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
        /* Primary brand — Emergency Gold */
        default:
          'bg-brand-500 text-gray-900 hover:bg-brand-400 shadow-brand-sm hover:shadow-brand-md',
        /* Danger/Destructive */
        destructive:
          'bg-red-600 text-white hover:bg-red-500 shadow-sm',
        /* Outline — theme-aware */
        outline:
          'border border-border bg-transparent text-foreground hover:border-border-strong hover:bg-background-elevated',
        /* Secondary — subtle fill */
        secondary:
          'bg-background-elevated text-foreground hover:bg-background-alt border border-border',
        /* Ghost */
        ghost:
          'text-foreground-muted hover:bg-background-elevated hover:text-foreground',
        /* Link style */
        link:
          'text-brand-600 underline-offset-4 hover:underline p-0 h-auto font-medium',
        /* Emergency red */
        emergency:
          'bg-red-600 text-white hover:bg-red-500 shadow-emergency-md hover:shadow-[0_0_40px_rgba(239,68,68,0.35)]',
        /* Brand emphasis (bold) */
        brand:
          'bg-brand-500 text-gray-900 hover:bg-brand-400 font-extrabold shadow-brand-sm hover:shadow-brand-md',
        /* Muted/glass */
        muted:
          'bg-muted text-muted-foreground hover:bg-background-elevated border border-border',
      },
      size: {
        sm:      'h-8 px-3.5 text-xs rounded-lg',
        default: 'h-10 px-5 py-2',
        lg:      'h-12 px-7 text-base rounded-xl',
        xl:      'h-14 px-9 text-base rounded-2xl',
        icon:    'h-10 w-10',
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
