import { AnswerResult, UserProfile, UserProgress, UserSettings } from '@/src/types/models';

export interface ProgressRepository {
  getProfiles(): Promise<UserProfile[]>;
  getProfile(): Promise<UserProfile | undefined>;
  createProfile(firstName: string): Promise<UserProfile>;
  selectProfile(profileId: string): Promise<UserProfile>;
  getSettings(): Promise<UserSettings>;
  saveSettings(settings: UserSettings): Promise<void>;
  getProgress(): Promise<UserProgress>;
  recordAnswer(answer: AnswerResult): Promise<UserProgress>;
}
