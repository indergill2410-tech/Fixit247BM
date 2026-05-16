'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export type UserRole = 'customer' | 'tradie' | 'admin';

export interface MobileNavProps {
  items: NavItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

export function MobileNav({
  items,
  activeHref,
  onNavigate,
  className,
}: MobileNavProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'flex sm:hidden items-center',
        'bg-white/90 backdrop-blur-md border-t border-gray-200',
        'pb-safe', // iOS safe area
        className,
      )}
      aria-label="Mobile navigation"
    >
      {items.map((item) => {
        const isActive = activeHref === item.href;
        const Icon = item.icon;

        return (
          <button
            key={item.href}
            type="button"
            onClick={() => onNavigate?.(item.href)}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center gap-0.5',
              'py-3 px-1 min-h-[56px]',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500',
              isActive ? 'text-brand-600' : 'text-gray-400',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Active background pill */}
            {isActive && (
              <motion.span
                className="absolute inset-x-3 top-1.5 h-8 rounded-full bg-blue-50"
                layoutId="mobile-nav-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}

            <motion.span
              className="relative z-10"
              whileTap={{ scale: 0.82 }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-brand-600' : 'text-gray-400',
                  )}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
            </motion.span>

            <span
              className={cn(
                'relative z-10 text-[10px] font-medium tracking-tight leading-none',
                isActive ? 'text-brand-600' : 'text-gray-400',
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Spacer ────────────────────────────────────────────────────────────────
// Add below page content to prevent overlap with fixed nav

export function MobileNavSpacer({ className }: { className?: string }) {
  return <div className={cn('block sm:hidden h-16', className)} />;
}
