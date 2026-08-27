// @ts-nocheck
// Visual topic images and metadata for topic-based vocabulary collections

export interface TopicVisualMeta {
  topic: string;
  coverImage: string;
  gradient: string;
  accentColor: string;
  iconName?: string;
}

export const TOPIC_VISUALS: Record<string, TopicVisualMeta> = {
  'Introducing Yourself': {
    topic: 'Introducing Yourself',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-amber-500/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'amber'
  },
  'Family & Relationships': {
    topic: 'Family & Relationships',
    coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-rose-500/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'rose'
  },
  'Daily Routine': {
    topic: 'Daily Routine',
    coverImage: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-orange-500/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'orange'
  },
  'Food & Meals': {
    topic: 'Food & Meals',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-emerald-500/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'emerald'
  },
  'Hobbies & Free Time': {
    topic: 'Hobbies & Free Time',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-purple-500/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'purple'
  },
  'Weather & Seasons': {
    topic: 'Weather & Seasons',
    coverImage: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-sky-500/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'sky'
  },
  'Shopping & Money': {
    topic: 'Shopping & Money',
    coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-teal-500/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'teal'
  },
  'Directions & Transportation': {
    topic: 'Directions & Transportation',
    coverImage: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-blue-500/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'blue'
  },
  'Home & Where You Live': {
    topic: 'Home & Where You Live',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-amber-600/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'amber'
  },
  'Health & Feelings': {
    topic: 'Health & Feelings',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-emerald-600/20 via-stone-900/40 to-stone-900/90',
    accentColor: 'emerald'
  }
};

const DEFAULT_TOPIC_VISUAL: TopicVisualMeta = {
  topic: 'Language Practice',
  coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
  gradient: 'from-indigo-500/20 via-stone-900/40 to-stone-900/90',
  accentColor: 'indigo'
};

export function getTopicVisual(topicName?: string | null, wordText?: string | null): { imageUrl: string; gradient: string; accentColor: string } {
  if (!topicName) {
    return {
      imageUrl: DEFAULT_TOPIC_VISUAL.coverImage,
      gradient: DEFAULT_TOPIC_VISUAL.gradient,
      accentColor: DEFAULT_TOPIC_VISUAL.accentColor
    };
  }

  const matchedKey = Object.keys(TOPIC_VISUALS).find(k => k.toLowerCase() === topicName.toLowerCase()) || 
                     Object.keys(TOPIC_VISUALS).find(k => topicName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(topicName.toLowerCase()));

  if (matchedKey && TOPIC_VISUALS[matchedKey]) {
    const meta = TOPIC_VISUALS[matchedKey];
    return {
      imageUrl: meta.coverImage,
      gradient: meta.gradient,
      accentColor: meta.accentColor
    };
  }

  return {
    imageUrl: DEFAULT_TOPIC_VISUAL.coverImage,
    gradient: DEFAULT_TOPIC_VISUAL.gradient,
    accentColor: DEFAULT_TOPIC_VISUAL.accentColor
  };
}
