import { AnswerResult, UserProfile, UserProgress, UserSettings } from '@/src/types/models';

export interface ProgressRepository {
  getProfile(): Promise<UserProfile>;
  getSettings(): Promise<UserSettings>;
  saveSettings(settings: UserSettings): Promise<void>;
  getProgress(): Promise<UserProgress>;
  recordAnswer(answer: AnswerResult): Promise<UserProgress>;
}
