'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const TabsRoot = TabsPrimitive.Root;

// List — horizontally scrollable on mobile
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'relative flex items-center gap-0 border-b border-border',
      'overflow-x-auto scrollbar-none',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// Trigger with animated underline via layoutId
interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  layoutId?: string;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, layoutId = 'tab-underline', ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative px-4 py-2.5 text-sm font-medium whitespace-nowrap',
      'text-foreground-muted transition-colors',
      'hover:text-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-t-lg',
      'data-[state=active]:text-brand-500',
      'disabled:pointer-events-none disabled:opacity-40',
      className,
    )}
    {...props}
  >
    {children}
    {/* Animated underline using CSS — triggers when data-state=active */}
    <span
      className={cn(
        'absolute bottom-0 left-0 right-0 h-0.5 rounded-full',
        'scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left',
        'bg-brand-600',
      )}
      data-state={(props as { 'data-state'?: string })['data-state']}
    />
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Animated underline approach using Framer Motion
// This alternative exports a context-aware list that auto-tracks the active indicator

interface MotionTabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  indicatorClassName?: string;
}

function MotionTabsList({
  className,
  children,
  indicatorClassName,
  ...props
}: MotionTabsListProps) {
  const [activeRect, setActiveRect] = React.useState<DOMRect | null>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Observe active trigger changes via MutationObserver
  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      const active = list.querySelector('[data-state="active"]') as HTMLElement | null;
      if (active && list) {
        const listRect = list.getBoundingClientRect();
        const triggerRect = active.getBoundingClientRect();
        setActiveRect({
          ...triggerRect,
          left: triggerRect.left - listRect.left,
          width: triggerRect.width,
        } as DOMRect);
      }
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(list, { attributes: true, subtree: true, attributeFilter: ['data-state'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={listRef}
      className={cn('relative border-b border-border overflow-x-auto scrollbar-none', className)}
    >
      <TabsPrimitive.List className="flex items-center gap-0" {...props}>
        {children}
      </TabsPrimitive.List>
      {activeRect && (
        <motion.div
          className={cn('absolute bottom-0 h-0.5 rounded-full bg-brand-500', indicatorClassName)}
          layoutId="tab-indicator"
          style={{ left: activeRect.left, width: activeRect.width }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}
    </div>
  );
}

// Content
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { TabsRoot, TabsList, TabsTrigger, TabsContent, MotionTabsList };
