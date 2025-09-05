'use client';

import { useState } from 'react';
import { auth } from '@/lib/auth';

interface CompactAuthFormProps {
  onSignIn: (email: string) => void;
}

export default function CompactAuthForm({ onSignIn }: CompactAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // Sign up with email and password
        const { error } = await auth.signUpWithEmail(email, password);
        if (error) {
          setMessage('Error: ' + error.message);
        } else {
          setMessage('Check your email to confirm your account!');
          onSignIn(email);
        }
      } else {
        // Sign in with email and password
        const { error } = await auth.signInWithPassword(email, password);
        if (error) {
          setMessage('Error: ' + error.message);
        } else {
          setMessage('Successfully signed in!');
          onSignIn(email);
        }
      }
    } catch {
      setMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="compact-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="compact-email"
            type="email"
            placeholder="Enter your email address"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="compact-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="compact-password"
            type="password"
            placeholder="Enter your password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading 
            ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
            : (isSignUp ? 'Sign Up' : 'Sign In')
          }
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-indigo-600 hover:text-indigo-500"
        >
          {isSignUp 
            ? 'Already have an account? Sign in' 
            : 'Don\'t have an account? Sign up'
          }
        </button>
      </div>

      {message && (
        <div className={`text-center text-xs ${
          message.includes('Error') ? 'text-red-600' : 'text-green-600'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
