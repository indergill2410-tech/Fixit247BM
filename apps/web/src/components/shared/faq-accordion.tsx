'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ faqs, namespace = 'faq' }: { faqs: FaqItem[]; namespace?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => {
        const panelId = `${namespace}-panel-${i}`;
        const isOpen = open === i;
        return (
          <div key={faq.q} className="overflow-hidden rounded-2xl border border-border bg-background-elevated">
            <button
              type="button"
              onClick={() => { setOpen(isOpen ? null : i); }}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <span className="pr-4 text-sm font-semibold text-foreground">{faq.q}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-foreground-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div id={panelId} role="region" className="border-t border-border px-6 pb-5 pt-4">
                <p className="text-sm leading-relaxed text-foreground-muted">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
