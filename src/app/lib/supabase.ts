// @ts-nocheck
/// <reference types="vite/client" />
import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let hasWarned = false;

// Supabase publishable keys are safe to ship in browser code. These defaults keep
// hosted builds working when the deployment platform does not inject VITE_* vars.
const DEFAULT_SUPABASE_URL = 'https://yxsxgchrkpmgqrhygmcl.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_AXQ7QRg0UJZcv4TbaTBIXA_qgyNt2qQ';

export interface SupabaseSyncPayload {
  id?: string;
  email?: string;
  settings?: any;
  userStats?: any;
  documents?: any[];
  highlights?: any[];
  annotations?: any[];
  stickyNotes?: any[];
  folders?: any[];
  decks?: any[];
  vocabulary?: any[];
  quizHistory?: any[];
  [key: string]: any;
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const env = (import.meta.env || {}) as Record<string, string | undefined>;
  const url = String(env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const key = String(env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY).trim();
  const isValidUrl = /^https?:\/\//.test(url);

  if (!isValidUrl || !key || url.includes('placeholder') || key.includes('placeholder')) {
    if (!hasWarned) {
      console.warn('Supabase configuration is invalid. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      hasWarned = true;
    }
    return null;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return null;
  }
}

function requireSupabase(): SupabaseClient {
  const client = getSupabase();
  if (!client) throw new Error('Supabase is not configured for this application.');
  return client;
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
  const client = requireSupabase();
  return client.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: name?.trim() ? { full_name: name.trim() } : undefined,
    },
  });
}

export async function signInWithEmail(email: string, password: string) {
  return requireSupabase().auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
}

export async function resendConfirmationEmail(email: string) {
  return requireSupabase().auth.resend({
    type: 'signup',
    email: email.trim().toLowerCase(),
    options: { emailRedirectTo: window.location.origin },
  });
}

export type SocialAuthProvider = 'google' | 'apple';

async function assertSocialProviderEnabled(provider: SocialAuthProvider): Promise<void> {
  const env = (import.meta.env || {}) as Record<string, string | undefined>;
  const url = String(env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const key = String(env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY).trim();
  try {
    const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
    if (!response.ok) return;
    const settings = await response.json();
    if (settings?.external?.[provider] === false) {
      const error = new Error(`${provider} provider is not enabled in Supabase Auth.`) as Error & { code?: string };
      error.code = 'provider-not-enabled';
      throw error;
    }
  } catch (error: any) {
    if (error?.code === 'provider-not-enabled') throw error;
    // If the settings endpoint is temporarily unavailable, let Supabase OAuth
    // return its authoritative response rather than blocking a valid provider.
  }
}

export async function signInWithSocialProvider(provider: SocialAuthProvider) {
  await assertSocialProviderEnabled(provider);
  return requireSupabase().auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
      queryParams: provider === 'apple' ? { prompt: 'login' } : undefined,
    },
  });
}

export async function signInWithGoogle() {
  return signInWithSocialProvider('google');
}

export async function signInWithApple() {
  return signInWithSocialProvider('apple');
}

export async function signOutFromSupabase() {
  return requireSupabase().auth.signOut();
}

export async function createUserAsAdmin(payload: { name: string; email: string; password: string; role?: string; targetLanguage?: string }) {
  return requireSupabase().functions.invoke('admin-create-user', { body: payload });
}

export function onSupabaseAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return requireSupabase().auth.onAuthStateChange(callback);
}

export async function getSupabaseUser(): Promise<User | null> {
  const { data, error } = await requireSupabase().auth.getUser();
  if (error) return null;
  return data.user;
}

export async function syncToSupabase(userId: string, payload: SupabaseSyncPayload): Promise<boolean> {
  const client = getSupabase();
  if (!client || !userId || userId === 'usr-1') return false;

  const profile = {
    id: userId,
    email: payload.email || payload.settings?.userEmail || '',
    name: payload.name || payload.settings?.userName || 'Learner',
    role: payload.role || 'Student',
    status: payload.status || 'Active',
    data: payload,
    updated_at: new Date().toISOString(),
  };
  const [progressResult, profileResult] = await Promise.all([
    client.from('user_progress').upsert(
      {
        id: userId,
        email: profile.email,
        data: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    ),
    client.from('user_profiles').upsert(profile, { onConflict: 'id' }),
  ]);

  if (progressResult.error || profileResult.error) {
    console.error('Supabase progress/profile sync error:', progressResult.error?.message || profileResult.error?.message);
    return false;
  }
  return true;
}

export async function fetchFromSupabase(userId: string): Promise<SupabaseSyncPayload | null> {
  const client = getSupabase();
  if (!client || !userId || userId === 'usr-1') return null;

  const [{ data: progress, error: progressError }, { data: profile, error: profileError }] = await Promise.all([
    client.from('user_progress').select('data').eq('id', userId).maybeSingle(),
    client.from('user_profiles').select('email,name,role,status,data').eq('id', userId).maybeSingle(),
  ]);

  if (progressError || profileError) {
    console.error('Supabase account fetch error:', progressError?.message || profileError?.message);
    return null;
  }
  return {
    ...((progress?.data as SupabaseSyncPayload | null) || {}),
    ...((profile?.data as SupabaseSyncPayload | null) || {}),
    email: profile?.email,
    name: profile?.name,
    role: profile?.role,
    status: profile?.status,
  };
}

export function subscribeToSupabaseProgress(userId: string, onPayload: (payload: SupabaseSyncPayload) => void) {
  const client = getSupabase();
  if (!client || !userId || userId === 'usr-1') return () => undefined;

  const channel = client
    .channel(`user-progress-${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'user_progress', filter: `id=eq.${userId}` },
      (event) => {
        const payload = (event.new as { data?: SupabaseSyncPayload } | null)?.data;
        if (payload) onPayload(payload);
      },
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

export async function recordUserActivity(userId: string, activity: any): Promise<boolean> {
  const client = getSupabase();
  if (!client || !userId || userId === 'usr-1') return false;

  const { error } = await client.from('user_activity').upsert({
    id: String(activity.id || `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    user_id: userId,
    data: activity,
    created_at: activity.timestamp || new Date().toISOString(),
  });

  if (error) {
    console.warn('Supabase activity sync notice:', error.message);
    return false;
  }
  return true;
}

export async function fetchSupabaseAds(): Promise<any[]> {
  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client.from('ads').select('id,data,active').eq('active', true);
  if (error) {
    console.warn('Supabase ads fetch notice:', error.message);
    return [];
  }
  return (data || []).map((row) => ({ id: row.id, ...(row.data || {}), active: row.active }));
}
