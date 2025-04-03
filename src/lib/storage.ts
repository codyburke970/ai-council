import { UserProfile } from './types';

const USER_PROFILE_KEY = 'ai-council-user-profile';

export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  }
};

export const getUserProfile = (): UserProfile | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export const clearUserProfile = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_PROFILE_KEY);
  }
}; 