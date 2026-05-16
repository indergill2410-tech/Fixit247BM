import type { Role } from '@fixit247/auth';
import {
  LayoutDashboard,
  Wrench,
  MessageSquare,
  Star,
  User,
  DollarSign,
  Calendar,
  FileText,
  Shield,
  Users,
  Settings,
  BarChart3,
} from 'lucide-react';
import * as React from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  CUSTOMER: [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Jobs', href: '/jobs', icon: <Wrench size={18} /> },
    { label: 'Messages', href: '/messages', icon: <MessageSquare size={18} /> },
    { label: 'Reviews', href: '/reviews', icon: <Star size={18} /> },
    { label: 'Profile', href: '/profile', icon: <User size={18} /> },
  ],
  TRADIE: [
    { label: 'Dashboard', href: '/tradie/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Jobs', href: '/tradie/jobs', icon: <Wrench size={18} /> },
    { label: 'Availability', href: '/tradie/availability', icon: <Calendar size={18} /> },
    { label: 'Earnings', href: '/tradie/earnings', icon: <DollarSign size={18} /> },
    { label: 'Documents', href: '/tradie/documents', icon: <FileText size={18} /> },
    { label: 'Messages', href: '/tradie/messages', icon: <MessageSquare size={18} /> },
    { label: 'Profile', href: '/tradie/profile', icon: <User size={18} /> },
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
    { label: 'Jobs', href: '/admin/jobs', icon: <Wrench size={18} /> },
    { label: 'Verifications', href: '/admin/verifications', icon: <Shield size={18} /> },
    { label: 'Payments', href: '/admin/payments', icon: <DollarSign size={18} /> },
    { label: 'Reports', href: '/admin/reports', icon: <BarChart3 size={18} /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
  ],
  SUPER_ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
    { label: 'Jobs', href: '/admin/jobs', icon: <Wrench size={18} /> },
    { label: 'Verifications', href: '/admin/verifications', icon: <Shield size={18} /> },
    { label: 'Payments', href: '/admin/payments', icon: <DollarSign size={18} /> },
    { label: 'Reports', href: '/admin/reports', icon: <BarChart3 size={18} /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
  ],
};
