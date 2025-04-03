export interface UserProfile {
  goals: string[];
  personality: string;
  pastChoices: string[];
  preferences: {
    communicationStyle: string;
    decisionMaking: string;
    riskTolerance: string;
  };
  lastUpdated: string;
} 