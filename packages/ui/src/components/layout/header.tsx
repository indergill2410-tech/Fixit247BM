'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function Header({ children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6',
        className,
      )}
    >
      {children}
    </header>
  );
}

export function HeaderBrand({ name = 'Fixit247' }: { name?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
        <span className="text-sm font-bold text-white">F</span>
      </div>
      <span className="text-lg font-bold text-foreground">{name}</span>
    </div>
  );
}
