'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import GameBoard from '@/components/GameBoard';
import CompactAuthForm from '@/components/CompactAuthForm';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    auth.getCurrentUser().then(({ user }) => {
      setUser(user ? { id: user.id, email: user.email || '' } : null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((user) => {
      setUser(user ? { id: user.id, email: user.email || '' } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">2048 Game</h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <span className="text-sm text-gray-600">
                  Play as guest (scores won&apos;t be saved)
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <GameBoard user={user} onScoreUpdate={setCurrentScore} />
          </div>

          {/* Dashboard */}
          <div className="lg:col-span-1">
            {user ? (
              <Dashboard user={user} currentScore={currentScore} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Sign in to save your scores
                </h2>
                <p className="text-gray-600 mb-4">
                  Create an account to track your personal best and compete on the leaderboard!
                </p>
                <div className="space-y-4">
                  <CompactAuthForm onSignIn={() => {}} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}