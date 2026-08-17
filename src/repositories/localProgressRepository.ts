import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_DAILY_GOAL } from '@/src/constants/math';
import { evaluateAchievements } from '@/src/features/progress/achievements';
import {
  createEmptyFactProgress,
  createFactKey,
  rekeyFactProgress,
} from '@/src/features/math/multiplicationFacts';
import { updateFactProgress } from '@/src/features/math/masteryCalculator';
import { ProgressRepository } from '@/src/repositories/progressRepository';
import { AnswerResult, UserProfile, UserProgress, UserSettings } from '@/src/types/models';

const STORAGE_KEY = 'bockmath.app-state.v1';
const LEGACY_PLACEHOLDER_NAME = 'math explorer';

const defaultSettings: UserSettings = {
  commutativeFacts: true,
  reducedMotion: false,
  dailyGoal: DEFAULT_DAILY_GOAL,
  focusedOperations: ['addition', 'subtraction', 'multiplication', 'division'],
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

type ProfileData = {
  profile: UserProfile;
  settings: UserSettings;
  progress: UserProgress;
};

type AppState = {
  activeProfileId?: string;
  profiles: Record<string, ProfileData>;
};

type LegacyAppState = ProfileData;

function createProfile(firstName: string): UserProfile {
  return {
    id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    firstName,
    level: 1,
    stars: 0,
    xp: 0,
    streakDays: 0,
  };
}

function normalizeProfileData(profileData: Partial<ProfileData>): ProfileData {
  return {
    profile: profileData.profile as UserProfile,
    settings: {
      ...defaultSettings,
      ...profileData.settings,
      focusedOperations: profileData.settings?.focusedOperations?.length
        ? profileData.settings.focusedOperations
        : defaultSettings.focusedOperations,
    },
    progress: {
      ...defaultProgress,
      ...profileData.progress,
      multiplicationFacts: profileData.progress?.multiplicationFacts ?? {},
      recentResults: profileData.progress?.recentResults ?? [],
      achievements: profileData.progress?.achievements ?? [],
    },
  };
}

function isPlaceholderProfile(profileData: ProfileData): boolean {
  return profileData.profile.firstName.trim().toLowerCase() === LEGACY_PLACEHOLDER_NAME;
}

async function loadState(): Promise<AppState> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: AppState = { profiles: {} };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(stored) as AppState | LegacyAppState;
    if ('profiles' in parsed) {
      const profiles = Object.fromEntries(
        Object.entries(parsed.profiles)
          .map(([id, profileData]) => [id, normalizeProfileData(profileData)] as const)
          .filter(([, profileData]) => !isPlaceholderProfile(profileData)),
      );
      const activeProfileId =
        parsed.activeProfileId && profiles[parsed.activeProfileId] ? parsed.activeProfileId : undefined;
      const normalized: AppState = { activeProfileId, profiles };
      if (
        Object.keys(profiles).length !== Object.keys(parsed.profiles).length ||
        activeProfileId !== parsed.activeProfileId
      ) {
        await saveState(normalized);
      }
      return normalized;
    }

    if (parsed.profile) {
      const legacyProfile = normalizeProfileData(parsed);
      if (isPlaceholderProfile(legacyProfile)) {
        const initial: AppState = { profiles: {} };
        await saveState(initial);
        return initial;
      }
      const migrated: AppState = {
        activeProfileId: legacyProfile.profile.id,
        profiles: { [legacyProfile.profile.id]: legacyProfile },
      };
      await saveState(migrated);
      return migrated;
    }

    return { profiles: {} };
  } catch {
    const initial: AppState = { profiles: {} };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

async function saveState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getActiveProfileData(state: AppState): ProfileData {
  const profileData = state.activeProfileId ? state.profiles[state.activeProfileId] : undefined;
  if (!profileData) {
    throw new Error('Select a user before saving progress.');
  }
  return profileData;
}

class LocalProgressRepository implements ProgressRepository {
  async getProfiles(): Promise<UserProfile[]> {
    return Object.values((await loadState()).profiles).map(({ profile }) => profile);
  }

  async getProfile(): Promise<UserProfile | undefined> {
    const state = await loadState();
    return state.activeProfileId ? state.profiles[state.activeProfileId]?.profile : undefined;
  }

  async createProfile(firstName: string): Promise<UserProfile> {
    const trimmedFirstName = firstName.trim();
    if (!trimmedFirstName) {
      throw new Error('Enter a name to create a user.');
    }

    const state = await loadState();
    const profile = createProfile(trimmedFirstName.slice(0, 40));
    await saveState({
      activeProfileId: profile.id,
      profiles: {
        ...state.profiles,
        [profile.id]: { profile, settings: defaultSettings, progress: defaultProgress },
      },
    });
    return profile;
  }

  async selectProfile(profileId: string): Promise<UserProfile> {
    const state = await loadState();
    const profile = state.profiles[profileId]?.profile;
    if (!profile) {
      throw new Error('That user could not be found.');
    }
    await saveState({ ...state, activeProfileId: profileId });
    return profile;
  }

  async getSettings(): Promise<UserSettings> {
    return getActiveProfileData(await loadState()).settings;
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    const state = await loadState();
    const profileData = getActiveProfileData(state);
    const nextProgress =
      profileData.settings.commutativeFacts === settings.commutativeFacts
        ? profileData.progress
        : {
            ...profileData.progress,
            multiplicationFacts: rekeyFactProgress(
              profileData.progress.multiplicationFacts,
              settings.commutativeFacts,
            ),
          };

    await saveState({
      ...state,
      profiles: {
        ...state.profiles,
        [profileData.profile.id]: { ...profileData, settings, progress: nextProgress },
      },
    });
  }

  async getProgress(): Promise<UserProgress> {
    return getActiveProfileData(await loadState()).progress;
  }

  async recordAnswer(answer: AnswerResult): Promise<UserProgress> {
    const state = await loadState();
    const profileData = getActiveProfileData(state);
    const { settings } = profileData;
    const attempts = profileData.progress.totalQuestions + 1;
    const totalCorrect = profileData.progress.totalCorrect + (answer.isCorrect ? 1 : 0);
    const averageResponseTimeMs = Math.round(
      (profileData.progress.averageResponseTimeMs * profileData.progress.totalQuestions +
        answer.responseTimeMs) /
        attempts,
    );
    const currentStreak = answer.isCorrect ? profileData.progress.currentStreak + 1 : 0;
    const nextProgress: UserProgress = {
      ...profileData.progress,
      totalQuestions: attempts,
      totalCorrect,
      currentStreak,
      longestStreak: Math.max(profileData.progress.longestStreak, currentStreak),
      averageResponseTimeMs,
      recentResults: [...profileData.progress.recentResults, answer].slice(-250),
    };

    if (answer.relatedFact) {
      const key = createFactKey(answer.relatedFact, settings.commutativeFacts);
      const current = nextProgress.multiplicationFacts[key] ?? createEmptyFactProgress(answer.relatedFact);
      nextProgress.multiplicationFacts = {
        ...nextProgress.multiplicationFacts,
        [key]: updateFactProgress(current, answer),
      };
    }

    nextProgress.achievements = evaluateAchievements(
      nextProgress,
      nextProgress.achievements,
      answer.answeredAt,
    );
    await saveState({
      ...state,
      profiles: {
        ...state.profiles,
        [profileData.profile.id]: { ...profileData, progress: nextProgress },
      },
    });
    return nextProgress;
  }
}

export const localProgressRepository = new LocalProgressRepository();
