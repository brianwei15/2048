'use client';

import { useState, useEffect } from 'react';
import { scores } from '@/lib/auth';

interface DashboardProps {
  user: { id: string; email: string };
  currentScore: number;
}

export default function Dashboard({ user, currentScore }: DashboardProps) {
  const [personalBest, setPersonalBest] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const bestScore = await scores.getUserBestScore();
        setPersonalBest(bestScore);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Update personal best when current score changes
  useEffect(() => {
    if (currentScore > personalBest && user) {
      setPersonalBest(currentScore);
    }
  }, [currentScore, personalBest, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Personal Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{personalBest}</div>
            <div className="text-gray-600">Personal Best</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{currentScore}</div>
            <div className="text-gray-600">Current Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
