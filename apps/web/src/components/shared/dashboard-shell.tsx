'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Role } from '@fixit247/auth';
import { DashboardLayout, Header, HeaderBrand, Sidebar, SidebarNavItem } from '@fixit247/ui';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/nav';

interface DashboardShellProps {
  children: React.ReactNode;
  role: Role;
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role] ?? [];

  return (
    <DashboardLayout
      sidebar={
        <Sidebar collapsed={collapsed}>
          <div className="flex h-16 items-center justify-between px-4">
            <HeaderBrand />
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-lg p-1 hover:bg-muted"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname.startsWith(item.href)}
                collapsed={collapsed}
                badge={item.badge}
              />
            ))}
          </nav>
        </Sidebar>
      }
      header={
        <Header>
          <div className="flex flex-1 items-center justify-between">
            <HeaderBrand />
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{role}</span>
            </div>
          </div>
        </Header>
      }
    >
      {children}
    </DashboardLayout>
  );
}
