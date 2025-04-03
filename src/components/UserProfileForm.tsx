'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { saveUserProfile, getUserProfile } from '@/lib/storage';

export default function UserProfileForm() {
  const [profile, setProfile] = useState<UserProfile>({
    goals: [''],
    personality: '',
    pastChoices: [''],
    preferences: {
      communicationStyle: '',
      decisionMaking: '',
      riskTolerance: '',
    },
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profile.lastUpdated = new Date().toISOString();
    saveUserProfile(profile);
  };

  const addGoal = () => {
    setProfile(prev => ({
      ...prev,
      goals: [...prev.goals, ''],
    }));
  };

  const addPastChoice = () => {
    setProfile(prev => ({
      ...prev,
      pastChoices: [...prev.pastChoices, ''],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">Personality</label>
          <textarea
            value={profile.personality}
            onChange={(e) => setProfile(prev => ({ ...prev, personality: e.target.value }))}
            className="w-full p-2 border rounded-md text-gray-900"
            rows={3}
            placeholder="Describe your personality..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Goals</label>
          {profile.goals.map((goal, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => {
                  const newGoals = [...profile.goals];
                  newGoals[index] = e.target.value;
                  setProfile(prev => ({ ...prev, goals: newGoals }));
                }}
                className="flex-1 p-2 border rounded-md text-gray-900"
                placeholder="Enter a goal..."
              />
              {index === profile.goals.length - 1 && (
                <button
                  type="button"
                  onClick={addGoal}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Past Choices</label>
          {profile.pastChoices.map((choice, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={choice}
                onChange={(e) => {
                  const newChoices = [...profile.pastChoices];
                  newChoices[index] = e.target.value;
                  setProfile(prev => ({ ...prev, pastChoices: newChoices }));
                }}
                className="flex-1 p-2 border rounded-md text-gray-900"
                placeholder="Enter a past choice..."
              />
              {index === profile.pastChoices.length - 1 && (
                <button
                  type="button"
                  onClick={addPastChoice}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferences</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Communication Style</label>
            <select
              value={profile.preferences.communicationStyle}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                preferences: { ...prev.preferences, communicationStyle: e.target.value }
              }))}
              className="w-full p-2 border rounded-md mb-1 text-gray-900"
            >
              <option value="">Select...</option>
              <option value="direct">Direct</option>
              <option value="diplomatic">Diplomatic</option>
              <option value="analytical">Analytical</option>
              <option value="empathetic">Empathetic</option>
            </select>
            <p className="text-sm text-gray-600 mb-4">How would you like advice to be delivered? Direct and to the point, diplomatic and tactful, analytical with data, or empathetic and supportive?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Decision Making</label>
            <select
              value={profile.preferences.decisionMaking}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                preferences: { ...prev.preferences, decisionMaking: e.target.value }
              }))}
              className="w-full p-2 border rounded-md mb-1 text-gray-900"
            >
              <option value="">Select...</option>
              <option value="intuitive">Intuitive</option>
              <option value="analytical">Analytical</option>
              <option value="collaborative">Collaborative</option>
              <option value="cautious">Cautious</option>
            </select>
            <p className="text-sm text-gray-600 mb-4">What's your preferred approach to making decisions? Trust your gut, analyze data, work with others, or carefully weigh all options?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
            <select
              value={profile.preferences.riskTolerance}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                preferences: { ...prev.preferences, riskTolerance: e.target.value }
              }))}
              className="w-full p-2 border rounded-md mb-1 text-gray-900"
            >
              <option value="">Select...</option>
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
            <p className="text-sm text-gray-600 mb-4">How comfortable are you with taking risks? Conservative (minimize risks), moderate (balanced approach), or aggressive (embrace calculated risks)?</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Save Profile
      </button>
    </form>
  );
} 