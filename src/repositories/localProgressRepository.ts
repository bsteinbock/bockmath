import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_DAILY_GOAL } from '@/src/constants/math';
import { evaluateAchievements } from '@/src/features/progress/achievements';
import { createEmptyFactProgress, createFactKey, rekeyFactProgress } from '@/src/features/math/multiplicationFacts';
import { updateFactProgress } from '@/src/features/math/masteryCalculator';
import { ProgressRepository } from '@/src/repositories/progressRepository';
import { AnswerResult, UserProfile, UserProgress, UserSettings } from '@/src/types/models';

const STORAGE_KEY = 'bockmath.app-state.v1';

const defaultProfile: UserProfile = {
  id: 'default-profile',
  firstName: 'Math Explorer',
  level: 1,
  stars: 0,
  xp: 0,
  streakDays: 0,
};

const defaultSettings: UserSettings = {
  commutativeFacts: true,
  reducedMotion: false,
  dailyGoal: DEFAULT_DAILY_GOAL,
};

const defaultProgress: UserProgress = {
  totalQuestions: 0,
  totalCorrect: 0,
  currentStreak: 0,
  longestStreak: 0,
  averageResponseTimeMs: 0,
  recentResults: [],
  multiplicationFacts: {},
  achievements: [],
};

type AppState = {
  profile: UserProfile;
  settings: UserSettings;
  progress: UserProgress;
};

async function loadState(): Promise<AppState> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial = {
      profile: defaultProfile,
      settings: defaultSettings,
      progress: defaultProgress,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(stored) as AppState;
    return {
      profile: parsed.profile ?? defaultProfile,
      settings: parsed.settings ?? defaultSettings,
      progress: {
        ...defaultProgress,
        ...parsed.progress,
        multiplicationFacts: parsed.progress?.multiplicationFacts ?? {},
        recentResults: parsed.progress?.recentResults ?? [],
        achievements: parsed.progress?.achievements ?? [],
      },
    };
  } catch {
    const initial = {
      profile: defaultProfile,
      settings: defaultSettings,
      progress: defaultProgress,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

async function saveState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

class LocalProgressRepository implements ProgressRepository {
  async getProfile(): Promise<UserProfile> {
    return (await loadState()).profile;
  }

  async getSettings(): Promise<UserSettings> {
    return (await loadState()).settings;
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    const state = await loadState();
    const nextProgress =
      state.settings.commutativeFacts === settings.commutativeFacts
        ? state.progress
        : {
            ...state.progress,
            multiplicationFacts: rekeyFactProgress(state.progress.multiplicationFacts, settings.commutativeFacts),
          };

    await saveState({
      ...state,
      settings,
      progress: nextProgress,
    });
  }

  async getProgress(): Promise<UserProgress> {
    return (await loadState()).progress;
  }

  async recordAnswer(answer: AnswerResult): Promise<UserProgress> {
    const state = await loadState();
    const { settings } = state;
    const attempts = state.progress.totalQuestions + 1;
    const totalCorrect = state.progress.totalCorrect + (answer.isCorrect ? 1 : 0);
    const averageResponseTimeMs = Math.round(
      (state.progress.averageResponseTimeMs * state.progress.totalQuestions + answer.responseTimeMs) / attempts,
    );
    const currentStreak = answer.isCorrect ? state.progress.currentStreak + 1 : 0;
    const nextProgress: UserProgress = {
      ...state.progress,
      totalQuestions: attempts,
      totalCorrect,
      currentStreak,
      longestStreak: Math.max(state.progress.longestStreak, currentStreak),
      averageResponseTimeMs,
      recentResults: [...state.progress.recentResults, answer].slice(-250),
    };

    if (answer.relatedFact) {
      const key = createFactKey(answer.relatedFact, settings.commutativeFacts);
      const current = nextProgress.multiplicationFacts[key] ?? createEmptyFactProgress(answer.relatedFact);
      nextProgress.multiplicationFacts = {
        ...nextProgress.multiplicationFacts,
        [key]: updateFactProgress(current, answer),
      };
    }

    nextProgress.achievements = evaluateAchievements(nextProgress, nextProgress.achievements, answer.answeredAt);
    await saveState({ ...state, progress: nextProgress });
    return nextProgress;
  }
}

export const localProgressRepository = new LocalProgressRepository();
