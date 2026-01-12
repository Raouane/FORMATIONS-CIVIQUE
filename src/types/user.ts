import { UserLevel } from './database';

export interface UserStatus {
  isPremium: boolean;
  subscriptionActive: boolean;
}

export interface UserProfileExtended {
  id: string;
  email: string;
  fullName: string | null;
  objective: UserLevel;
  isPremium: boolean;
  subscriptionStatus: string | null;
}
