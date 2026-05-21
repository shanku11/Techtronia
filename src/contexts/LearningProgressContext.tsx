import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchWithAuth } from '@/lib/api';

export interface TopicProgress {
  animationComplete: boolean;
  explanationComplete: boolean;
  practiceComplete: boolean;
  testComplete: boolean;
  testScore: number;
  realWorldComplete: boolean;
  totalProgress: number;
}

interface LearningProgressContextType {
  progress: Record<string, TopicProgress>;
  updateTopicProgress: (topicId: string, updates: Partial<TopicProgress>) => void;
  isTopicUnlocked: (topicSlug: string, topicIndex: number, allTopicSlugs?: string[]) => boolean;
  getTopicProgress: (topicId: string) => TopicProgress;
  calculateTotalProgress: (topicId: string) => number;
  xpPoints: number;
  addXP: (points: number) => Promise<void>;
  badges: string[];
  addBadge: (badge: string) => void;
  syncProgressToDb: (topicId: string, stage: string, completed: boolean, score?: number) => Promise<void>;
}

const defaultTopicProgress: TopicProgress = {
  animationComplete: false,
  explanationComplete: false,
  practiceComplete: false,
  testComplete: false,
  testScore: 0,
  realWorldComplete: false,
  totalProgress: 0,
};

const stageMapping: Record<string, keyof TopicProgress> = {
  animation: 'animationComplete',
  explanation: 'explanationComplete',
  practice: 'practiceComplete',
  test: 'testComplete',
  realworld: 'realWorldComplete',
};

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined);

export const LearningProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [progress, setProgress] = useState<Record<string, TopicProgress>>(() => {
    const saved = localStorage.getItem('dsaLearningProgress');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [xpPoints, setXpPoints] = useState<number>(0);
  
  const [badges, setBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('dsaBadges');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (profile) {
      setXpPoints(profile.xp_points || 0);
    }
  }, [profile]);

  useEffect(() => {
    const loadProgressFromDb = async () => {
      if (!user) return;

      try {
        const dbProgress = await fetchWithAuth('/progress');
        if (dbProgress && dbProgress.length > 0) {
          const newProgress: Record<string, TopicProgress> = {};
          
          dbProgress.forEach((row: any) => {
            const topicSlug = row.topicSlug;
            if (!newProgress[topicSlug]) {
              newProgress[topicSlug] = { ...defaultTopicProgress };
            }
            
            const stageKey = stageMapping[row.stage];
            if (stageKey && row.stageCompleted) {
              (newProgress[topicSlug] as unknown as Record<string, unknown>)[stageKey] = true;
              if (row.stage === 'test' && row.score) {
                newProgress[topicSlug].testScore = row.score;
              }
            }
          });

          Object.keys(newProgress).forEach((topicSlug) => {
            let total = 0;
            const tp = newProgress[topicSlug];
            if (tp.animationComplete) total += 20;
            if (tp.explanationComplete) total += 20;
            if (tp.practiceComplete) total += 25;
            if (tp.testComplete) total += 25;
            if (tp.realWorldComplete) total += 10;
            newProgress[topicSlug].totalProgress = total;
          });

          setProgress((prev) => ({ ...prev, ...newProgress }));
        }
      } catch (error) {
        console.error('Error fetching progress from DB', error);
      }
    };

    loadProgressFromDb();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('dsaLearningProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('dsaBadges', JSON.stringify(badges));
  }, [badges]);

  const calculateTotalProgress = useCallback((topicId: string): number => {
    const topicProgress = progress[topicId] || defaultTopicProgress;
    let total = 0;
    if (topicProgress.animationComplete) total += 20;
    if (topicProgress.explanationComplete) total += 20;
    if (topicProgress.practiceComplete) total += 25;
    if (topicProgress.testComplete) total += 25;
    if (topicProgress.realWorldComplete) total += 10;
    return total;
  }, [progress]);

  const syncProgressToDb = async (topicId: string, stage: string, completed: boolean, score?: number) => {
    if (!user) return;

    try {
      await fetchWithAuth('/progress/sync', {
        method: 'POST',
        body: JSON.stringify({
          topicSlug: topicId,
          stage,
          completed,
          score
        })
      });
    } catch (error) {
      console.error('Error syncing progress:', error);
    }
  };

  const updateTopicProgress = (topicId: string, updates: Partial<TopicProgress>) => {
    setProgress((prev) => {
      const current = prev[topicId] || defaultTopicProgress;
      const updated = { ...current, ...updates };
      
      let total = 0;
      if (updated.animationComplete) total += 20;
      if (updated.explanationComplete) total += 20;
      if (updated.practiceComplete) total += 25;
      if (updated.testComplete) total += 25;
      if (updated.realWorldComplete) total += 10;
      updated.totalProgress = total;
      
      return { ...prev, [topicId]: updated };
    });
  };

  const isTopicUnlocked = (topicSlug: string, topicIndex: number, allTopicSlugs?: string[]): boolean => {
    if (topicIndex === 0) return true;
    
    const topics = allTopicSlugs || ['stack', 'queue', 'linkedlist', 'trees', 'graphs', 'sorting', 'searching'];
    const prevTopicSlug = topics[topicIndex - 1];
    if (!prevTopicSlug) return false;
    
    const prevProgress = progress[prevTopicSlug];
    if (!prevProgress) return false;
    return prevProgress.totalProgress >= 100;
  };

  const getTopicProgress = (topicId: string): TopicProgress => {
    return progress[topicId] || defaultTopicProgress;
  };

  const addXP = async (points: number) => {
    if (!user) {
      setXpPoints((prev) => prev + points);
      return;
    }

    try {
      await fetchWithAuth('/progress/xp', {
        method: 'POST',
        body: JSON.stringify({ points })
      });
      setXpPoints((prev) => prev + points);
      await refreshProfile();
    } catch (error) {
      console.error('Error adding XP', error);
    }
  };

  const addBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges((prev) => [...prev, badge]);
    }
  };

  return (
    <LearningProgressContext.Provider
      value={{
        progress,
        updateTopicProgress,
        isTopicUnlocked,
        getTopicProgress,
        calculateTotalProgress,
        xpPoints,
        addXP,
        badges,
        addBadge,
        syncProgressToDb,
      }}
    >
      {children}
    </LearningProgressContext.Provider>
  );
};

export const useLearningProgress = () => {
  const context = useContext(LearningProgressContext);
  if (!context) {
    throw new Error('useLearningProgress must be used within a LearningProgressProvider');
  }
  return context;
};
