// @ts-nocheck
export const getLocalDateString = (date: Date = new Date()): string => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

export const generateSampleActivityHistory = (_dailyGoal: number = 10): Record<string, number> => {
  return {};
};

export const calculateStreak = (activityHistory: Record<string, number> = {}, dailyGoal: number = 10): number => {
  let streak = 0;
  const today = new Date();
  
  const todayStr = getLocalDateString(today);
  
  // A day counts towards the streak if there is any activity (activity > 0)
  const todayActive = (activityHistory[todayStr] || 0) > 0;

  // Check yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);
  const yesterdayActive = (activityHistory[yesterdayStr] || 0) > 0;

  // If neither today nor yesterday had any activity, the streak is 0
  if (!todayActive && !yesterdayActive) {
    return 0;
  }

  // Scan backwards starting from today (or yesterday if today is not active yet)
  let currentSearchDate = new Date(today);
  if (!todayActive && yesterdayActive) {
    currentSearchDate = yesterday;
  }

  // To prevent infinite loop in edge cases, cap the scan to 365 days
  for (let i = 0; i < 365; i++) {
    const dateStr = getLocalDateString(currentSearchDate);
    const activity = activityHistory[dateStr] || 0;
    if (activity > 0) {
      streak++;
      currentSearchDate.setDate(currentSearchDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
