'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardLayout, Header, HeaderBrand, Sidebar, SidebarNavItem } from '@fixit247/ui';
import {
  LayoutDashboard, Users, Wrench, Shield,
  DollarSign, BarChart3, Settings, Menu, X,
  ShieldCheck, AlertOctagon, Scale, Ban,
  Settings2, LifeBuoy, Bell,
  Globe, Megaphone, TrendingUp, Phone,
} from 'lucide-react';

const NAV_MAIN = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Users', href: '/users', icon: <Users size={18} /> },
  { label: 'Jobs', href: '/jobs', icon: <Wrench size={18} /> },
  { label: 'Verifications', href: '/verifications', icon: <Shield size={18} />, badge: 14 },
  { label: 'Payments', href: '/payments', icon: <DollarSign size={18} /> },
  { label: 'Reports', href: '/reports', icon: <BarChart3 size={18} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
];

const NAV_INTELLIGENCE = [
  { label: 'Trust Engine', href: '/trust', icon: <ShieldCheck size={18} /> },
  { label: 'Fraud Detection', href: '/fraud', icon: <AlertOctagon size={18} /> },
  { label: 'Disputes', href: '/disputes', icon: <Scale size={18} /> },
  { label: 'Moderation', href: '/moderation', icon: <Ban size={18} /> },
];

const NAV_VOICE = [
  { label: 'Call Center', href: '/calls', icon: <Phone size={18} /> },
];

const NAV_PLATFORM = [
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Marketplace', href: '/marketplace', icon: <Settings2 size={18} /> },
  { label: 'Support', href: '/support', icon: <LifeBuoy size={18} /> },
  { label: 'Alerts', href: '/alerts', icon: <Bell size={18} /> },
  { label: 'Market Expansion', href: '/expansion', icon: <Globe size={18} /> },
  { label: 'Campaigns', href: '/campaigns', icon: <Megaphone size={18} /> },
  { label: 'Growth Analytics', href: '/growth', icon: <TrendingUp size={18} /> },
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
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            {/* Core */}
            <div className="space-y-1">
              {NAV_MAIN.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={pathname.startsWith(item.href)}
                  collapsed={collapsed}
                  {...('badge' in item && item.badge !== undefined ? { badge: item.badge } : {})}
                />
              ))}
            </div>

            {/* Intelligence section */}
            <div className="mt-6">
              {!collapsed && (
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Intelligence
                </p>
              )}
              <div className="space-y-1">
                {NAV_INTELLIGENCE.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={pathname.startsWith(item.href)}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>

            {/* Voice section */}
            <div className="mt-6">
              {!collapsed && (
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Voice
                </p>
              )}
              <div className="space-y-1">
                {NAV_VOICE.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={pathname.startsWith(item.href)}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>

            {/* Platform section */}
            <div className="mt-6">
              {!collapsed && (
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Platform
                </p>
              )}
              <div className="space-y-1">
                {NAV_PLATFORM.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={pathname.startsWith(item.href)}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
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
