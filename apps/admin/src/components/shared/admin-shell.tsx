'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardLayout, Header, HeaderBrand, Sidebar, SidebarNavItem } from '@fixit247/ui';
import {
  LayoutDashboard, Users, Wrench, Shield,
  DollarSign, BarChart3, Settings, Menu, X,
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Users', href: '/users', icon: <Users size={18} /> },
  { label: 'Jobs', href: '/jobs', icon: <Wrench size={18} /> },
  { label: 'Verifications', href: '/verifications', icon: <Shield size={18} />, badge: 14 },
  { label: 'Payments', href: '/payments', icon: <DollarSign size={18} /> },
  { label: 'Reports', href: '/reports', icon: <BarChart3 size={18} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <DashboardLayout
      sidebar={
        <Sidebar collapsed={collapsed}>
          <div className="flex h-16 items-center justify-between px-4">
            <HeaderBrand name="Fixit247 Admin" />
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-lg p-1 hover:bg-muted"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {NAV.map((item) => (
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
            <HeaderBrand name="Fixit247 Admin" />
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
              ADMIN CONSOLE
            </span>
          </div>
        </Header>
      }
    >
      {children}
    </DashboardLayout>
  );
}
