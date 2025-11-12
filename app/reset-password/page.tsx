'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Invalid or expired reset link. Please request a new password reset.');
        setIsValidating(false);
      } else {
        setIsValidating(false);
      }
    };

    checkSession();
  }, []);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }

    setIsLoading(false);
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center">
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (error && !password) {
    return (
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif text-[#3a3a3a] mb-4">Reset Link Invalid</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <a 
              href="/forgot-password"
              className="inline-block px-6 py-3 rounded-lg font-medium transition-colors"
              style={{backgroundColor: '#000080', color: 'white'}}
            >
              Request New Reset Link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#3a3a3a] mb-2">
            Create New Password
          </h1>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            style={{backgroundColor: '#000080', color: 'white'}}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}