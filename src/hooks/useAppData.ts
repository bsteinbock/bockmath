import { useCallback, useEffect, useState } from 'react';

import { localProgressRepository } from '@/src/repositories/localProgressRepository';
import { AnswerResult, UserProfile, UserProgress, UserSettings } from '@/src/types/models';

type AppDataState = {
  loading: boolean;
  error?: string;
  profile?: UserProfile;
  progress?: UserProgress;
  settings?: UserSettings;
};

export function useAppData() {
  const [state, setState] = useState<AppDataState>({ loading: true });

  const refresh = useCallback(async () => {
    try {
      const [profile, progress, settings] = await Promise.all([
        localProgressRepository.getProfile(),
        localProgressRepository.getProgress(),
        localProgressRepository.getSettings(),
      ]);
      setState({ loading: false, profile, progress, settings });
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : 'Unable to load app data.' });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveSettings = useCallback(async (settings: UserSettings) => {
    await localProgressRepository.saveSettings(settings);
    await refresh();
  }, [refresh]);

  const recordAnswer = useCallback(async (answer: AnswerResult) => {
    const progress = await localProgressRepository.recordAnswer(answer);
    setState((current) => ({ ...current, progress }));
    return progress;
  }, []);

  return {
    ...state,
    refresh,
    saveSettings,
    recordAnswer,
  };
}
