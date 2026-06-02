'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardLayout, Header, Sidebar, SidebarNavItem } from '@fixit247/ui';
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
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 172 176" fill="none">
                <defs>
                  <linearGradient id="admlogo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FCD34D"/>
                    <stop offset="100%" stopColor="#D97706"/>
                  </linearGradient>
                </defs>
                <rect x="0" y="4" width="172" height="172" rx="36" fill="url(#admlogo)"/>
                <path d="M118 22C138 22 154 37 156 57C157 69 152 80 143 87L90 140L95 145C98 148 98 154 95 157L65 187C59 193 49 193 43 187C37 181 37 171 43 165L73 135C76 132 82 132 85 135L90 140L143 87C151 80 156 69 154 57C151 38 136 22 118 22Z M118 42C128 42 136 50 136 60C136 67 132 73 127 77L108 58C112 53 115 48 116 42C116.7 42 117.3 42 118 42Z" fill="#1E2235" fillRule="evenodd"/>
              </svg>
              {!collapsed && <span className="text-sm font-bold text-foreground">Fixit<span className="text-amber-500">247</span> Admin</span>}
            </div>
            <button onClick={() => { setCollapsed(!collapsed); }} className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground" aria-label="Toggle sidebar">
              {collapsed ? <Menu size={16} /> : <X size={16} />}
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
                  {...('badge' in item ? { badge: item.badge } : {})}
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
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 172 176" fill="none">
                <defs>
                  <linearGradient id="admlogo2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FCD34D"/>
                    <stop offset="100%" stopColor="#D97706"/>
                  </linearGradient>
                </defs>
                <rect x="0" y="4" width="172" height="172" rx="36" fill="url(#admlogo2)"/>
                <path d="M118 22C138 22 154 37 156 57C157 69 152 80 143 87L90 140L95 145C98 148 98 154 95 157L65 187C59 193 49 193 43 187C37 181 37 171 43 165L73 135C76 132 82 132 85 135L90 140L143 87C151 80 156 69 154 57C151 38 136 22 118 22Z M118 42C128 42 136 50 136 60C136 67 132 73 127 77L108 58C112 53 115 48 116 42C116.7 42 117.3 42 118 42Z" fill="#1E2235" fillRule="evenodd"/>
              </svg>
              <span className="text-sm font-bold text-foreground">Fixit<span className="text-amber-500">247</span> Admin</span>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
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
