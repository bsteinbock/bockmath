import { useCallback, useEffect, useState } from 'react';

import { localProgressRepository } from '@/src/repositories/localProgressRepository';
import { AnswerResult, UserProfile, UserProgress, UserSettings } from '@/src/types/models';

type AppDataState = {
  loading: boolean;
  error?: string;
  profiles: UserProfile[];
  profile?: UserProfile;
  progress?: UserProgress;
  settings?: UserSettings;
};

export function useAppData() {
  const [state, setState] = useState<AppDataState>({ loading: true, profiles: [] });

  const refresh = useCallback(async () => {
    try {
      const [profiles, profile] = await Promise.all([
        localProgressRepository.getProfiles(),
        localProgressRepository.getProfile(),
      ]);
      if (!profile) {
        setState({ loading: false, profiles });
        return;
      }
      const [progress, settings] = await Promise.all([
        localProgressRepository.getProgress(),
        localProgressRepository.getSettings(),
      ]);
      setState({ loading: false, profiles, profile, progress, settings });
    } catch (error) {
      setState({
        loading: false,
        profiles: [],
        error: error instanceof Error ? error.message : 'Unable to load app data.',
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveSettings = useCallback(
    async (settings: UserSettings) => {
      await localProgressRepository.saveSettings(settings);
      await refresh();
    },
    [refresh],
  );

  const createProfile = useCallback(
    async (firstName: string) => {
      await localProgressRepository.createProfile(firstName);
      await refresh();
    },
    [refresh],
  );

  const selectProfile = useCallback(
    async (profileId: string) => {
      await localProgressRepository.selectProfile(profileId);
      await refresh();
    },
    [refresh],
  );

  const recordAnswer = useCallback(async (answer: AnswerResult) => {
    const progress = await localProgressRepository.recordAnswer(answer);
    setState((current) => ({ ...current, progress }));
    return progress;
  }, []);

  return {
    ...state,
    refresh,
    createProfile,
    selectProfile,
    saveSettings,
    recordAnswer,
  };
}
