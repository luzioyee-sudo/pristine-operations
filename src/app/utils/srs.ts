// @ts-nocheck
import { VocabularyItem } from '../types';

export const SRS_CONFIG = {
  LEARNING_STEPS: [1, 10], // in minutes
  RELEARNING_STEPS: [10], // in minutes
  GRADUATING_INTERVAL: 1, // days
  EASY_INTERVAL: 4, // days
  STARTING_EASE: 2.5,
  MIN_EASE: 1.3,
  HARD_INTERVAL_MULT: 1.2,
  EASY_INTERVAL_MULT: 1.3,
  EASE_DELTA_HARD: -0.15,
  EASE_DELTA_EASY: +0.15,
  EASE_DELTA_LAPSE: -0.20,
  FUZZ_RANGE: 0.08,
  MASTERY_INTERVAL_DAYS: 21,
  MASTERY_MIN_REPS: 2,
  LEECH_LAPSE_THRESHOLD: 8,
};

export type ButtonAction = "again" | "hard" | "good" | "easy";

export function reviewCard(card: VocabularyItem, button: ButtonAction): VocabularyItem {
  const now = Date.now();
  let {
    state = "new",
    learningStepIndex = 0,
    intervalDays = 0,
    easeFactor = SRS_CONFIG.STARTING_EASE,
    repetitions = 0,
    lapses = 0,
    dueAt = now,
  } = card.srs || {};

  if (state === "new") {
    state = "learning";
    learningStepIndex = 0;
  }

  if (state === "learning" || state === "relearning") {
    const steps = state === "learning" ? SRS_CONFIG.LEARNING_STEPS : SRS_CONFIG.RELEARNING_STEPS;
    
    if (button === "again") {
      learningStepIndex = 0;
      dueAt = now + steps[0] * 60 * 1000;
    } else if (button === "hard") {
      const delayMins = steps[learningStepIndex] * 1.5;
      dueAt = now + delayMins * 60 * 1000;
    } else if (button === "good") {
      learningStepIndex += 1;
      if (learningStepIndex >= steps.length) {
        state = "review";
        intervalDays = SRS_CONFIG.GRADUATING_INTERVAL;
        repetitions = 1;
        dueAt = now + intervalDays * 24 * 60 * 60 * 1000;
      } else {
        dueAt = now + steps[learningStepIndex] * 60 * 1000;
      }
    } else if (button === "easy") {
      state = "review";
      intervalDays = SRS_CONFIG.EASY_INTERVAL;
      repetitions = 1;
      dueAt = now + intervalDays * 24 * 60 * 60 * 1000;
    }
  } else if (state === "review") {
    if (button === "again") {
      lapses += 1;
      repetitions = 0;
      easeFactor = Math.max(SRS_CONFIG.MIN_EASE, easeFactor + SRS_CONFIG.EASE_DELTA_LAPSE);
      state = "relearning";
      learningStepIndex = 0;
      dueAt = now + SRS_CONFIG.RELEARNING_STEPS[0] * 60 * 1000;
    } else if (button === "hard") {
      easeFactor = Math.max(SRS_CONFIG.MIN_EASE, easeFactor + SRS_CONFIG.EASE_DELTA_HARD);
      intervalDays = intervalDays * SRS_CONFIG.HARD_INTERVAL_MULT;
      repetitions += 1;
      const fuzz = intervalDays * (Math.random() * (SRS_CONFIG.FUZZ_RANGE * 2) - SRS_CONFIG.FUZZ_RANGE);
      const finalInterval = intervalDays + fuzz;
      dueAt = now + finalInterval * 24 * 60 * 60 * 1000;
    } else if (button === "good") {
      intervalDays = intervalDays * easeFactor;
      repetitions += 1;
      const fuzz = intervalDays * (Math.random() * (SRS_CONFIG.FUZZ_RANGE * 2) - SRS_CONFIG.FUZZ_RANGE);
      const finalInterval = intervalDays + fuzz;
      dueAt = now + finalInterval * 24 * 60 * 60 * 1000;
    } else if (button === "easy") {
      easeFactor = easeFactor + SRS_CONFIG.EASE_DELTA_EASY;
      intervalDays = intervalDays * easeFactor * SRS_CONFIG.EASY_INTERVAL_MULT;
      repetitions += 1;
      const fuzz = intervalDays * (Math.random() * (SRS_CONFIG.FUZZ_RANGE * 2) - SRS_CONFIG.FUZZ_RANGE);
      const finalInterval = intervalDays + fuzz;
      dueAt = now + finalInterval * 24 * 60 * 60 * 1000;
    }
  }

  const lastReviewedAt = now;

  return {
    ...card,
    srs: {
      state,
      learningStepIndex,
      intervalDays,
      easeFactor,
      repetitions,
      lapses,
      dueAt,
      lastReviewedAt,
    },
  };
}

export function getCardBucket(card: VocabularyItem): "New" | "Learning" | "Mastered" {
  const { state = "new", intervalDays = 0, repetitions = 0 } = card.srs || {};
  if (state === "new") return "New";
  if (state === "learning" || state === "relearning") return "Learning";
  
  if (
    state === "review" && 
    intervalDays >= SRS_CONFIG.MASTERY_INTERVAL_DAYS && 
    repetitions >= SRS_CONFIG.MASTERY_MIN_REPS
  ) {
    return "Mastered";
  }
  return "Learning";
}

export function getDueIntervalLabel(card: VocabularyItem, button: ButtonAction): string {
  // Compute without mutating
  const simulatedCard = reviewCard(card, button);
  const diffMs = simulatedCard.srs!.dueAt - Date.now();
  
  if (diffMs < 0) return 'Now';
  
  const diffMins = Math.round(diffMs / (60 * 1000));
  if (diffMins < 60) return `${diffMins}m`;
  
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d`;
  
  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo`;
  
  const diffYears = Math.round(diffDays / 365);
  return `${diffYears}y`;
}

export function formatIntervalText(intervalInDays: number): string {
  if (intervalInDays <= 1) return '1d';
  if (intervalInDays < 30) return `${Math.round(intervalInDays)}d`;
  const months = Math.round(intervalInDays / 30);
  return `${months}m`;
}
