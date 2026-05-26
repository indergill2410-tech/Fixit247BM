import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
        outline: 'border border-border text-foreground',
        success: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
        emergency: 'bg-red-600 text-white animate-pulse',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
