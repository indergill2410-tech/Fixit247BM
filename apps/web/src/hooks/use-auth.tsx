'use client';

import * as React from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Role } from '@fixit247/auth';

interface AuthUser {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  onboardingComplete: boolean;
  emailVerified: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

function mapUser(supabaseUser: User): AuthUser {
  const meta = supabaseUser.user_metadata as Record<string, unknown>;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    role: (meta.role as Role | undefined) ?? 'CUSTOMER',
    firstName: (meta.firstName as string | undefined) ?? '',
    lastName: (meta.lastName as string | undefined) ?? '',
    avatarUrl: (meta.avatarUrl as string | null | undefined) ?? null,
    onboardingComplete: (meta.onboardingComplete as boolean | undefined) ?? false,
    emailVerified: !!supabaseUser.email_confirmed_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    setUser(supabaseUser ? mapUser(supabaseUser) : null);
  }, []);

  React.useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    void supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ? mapUser(u) : null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ? mapUser(session.user) : null);
      setIsLoading(false);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  const signOut = React.useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function useRequireAuth(requiredRole?: Role) {
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (isLoading) return;
    if (!user) { window.location.href = '/login'; return; }
    if (requiredRole && user.role !== requiredRole) {
      window.location.href = '/unauthorized';
    }
  }, [user, isLoading, requiredRole]);

  return { user, isLoading };
}
