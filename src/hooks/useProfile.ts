import { useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
  university: string;
  interests: string[];
  careerPath: string;
  gender: "male" | "female" | "other" | "";
  avatarSeed: string;
  language: string;
  points: number;
  missionsCompleted: number;
  questionsAsked: number;
  studySessions: number;
  readingSessions: number;
  careerPathsGenerated: number;
  level: number;
  streak: number;
  isLoggedIn: boolean;
  isFirstLogin: boolean;
}

const INITIAL_PROFILE: UserProfile = {
  name: "",
  email: "",
  university: "",
  interests: [],
  careerPath: "",
  gender: "",
  avatarSeed: "default",
  language: "en",
  points: 0,
  missionsCompleted: 0,
  questionsAsked: 0,
  studySessions: 0,
  readingSessions: 0,
  careerPathsGenerated: 0,
  level: 1,
  streak: 0,
  isLoggedIn: false,
  isFirstLogin: false,
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    // Clean version: Always start fresh
    return INITIAL_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem("pathbridge_profile", JSON.stringify(profile));
    if (profile.isLoggedIn) {
      // Sync with backend
      fetch("/api/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, updates: profile })
      }).catch(console.error);
    }
  }, [profile]);

  const login = (userData: Partial<UserProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...userData,
      isLoggedIn: true
    }));
  };

  const logout = () => {
    setProfile(INITIAL_PROFILE);
    localStorage.removeItem("pathbridge_profile");
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const reset = () => {
    localStorage.removeItem("pathbridge_profile");
    setProfile(INITIAL_PROFILE);
  };

  const updateStats = (key: keyof UserProfile, amount: number = 1) => {
    setProfile(prev => {
      const newVal = (prev[key] as number) + amount;
      
      // Level logic:
      // Level 2 -> 200 XP
      // Level 3 -> 500 XP
      // Level 4 -> 1000 XP
      let newLevel = prev.level;
      const totalPoints = key === "points" ? newVal : prev.points;
      
      if (totalPoints >= 1000) newLevel = 4;
      else if (totalPoints >= 500) newLevel = 3;
      else if (totalPoints >= 200) newLevel = 2;
      else newLevel = 1;

      return {
        ...prev,
        [key]: newVal,
        level: newLevel
      };
    });
  };

  return { profile, login, logout, updateStats, updateProfile, reset };
}
