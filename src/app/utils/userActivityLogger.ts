// @ts-nocheck
import type { ActivityRecord } from '../types';
import { recordUserActivity } from '../lib/supabase';

export const UserActivityLogger = {
  async logEvent(log: ActivityRecord, userId: string, userSummary?: Record<string, any>): Promise<boolean> {
    return recordUserActivity(userId, {
      ...log,
      ...(userSummary || {}),
    });
  },

  async fetchUserLogs(_userId: string): Promise<ActivityRecord[]> {
    // The activity timeline is already kept in each user's local account cache.
    // Supabase records are written by logEvent and can be queried server-side when needed.
    return [];
  },
};
