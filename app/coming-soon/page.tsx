'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save email to Supabase
      const { error } = await supabase
        .from('email_signups')
        .insert([{ email }]);
      
      if (error) {
        if (error.code === '23505') {
          // Email already exists
          alert('This email is already signed up!');
        } else {
          console.error('Error:', error);
          alert('Something went wrong. Please try again.');
        }
        setLoading(false);
        return;
      }
      
      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            NeighborSOS
          </h1>
          <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Something Special is Coming...
          </h2>
          
          <p className="text-xl text-gray-600 mb-6">
            We're building a new way to help families in need this holiday season.
          </p>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-8">
            <p className="text-lg text-gray-800">
              <strong>Coming Soon:</strong> A platform connecting local charities with donors who want to make a direct impact.
            </p>
          </div>

          {!submitted ? (
            <>
              <p className="text-gray-700 mb-6">
                Be the first to know when we launch!
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Notify Me'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800 text-lg font-semibold">
                🎉 Thank you! We'll notify you when we launch!
              </p>
            </div>
          )}

          {/* Features Preview */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-orange-600 text-3xl mb-2">✨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Simple</h3>
              <p className="text-gray-600 text-sm">
                Sponsor a family need in just a few clicks
              </p>
            </div>
            <div>
              <div className="text-orange-600 text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Direct</h3>
              <p className="text-gray-600 text-sm">
                100% of your gift goes to the family
              </p>
            </div>
            <div>
              <div className="text-orange-600 text-3xl mb-2">💙</div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparent</h3>
              <p className="text-gray-600 text-sm">
                See exactly who you're helping
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-600 mt-8">
          Questions? Contact us at{' '}
          <a href="mailto:info@neighborsos.org" className="text-orange-600 hover:underline">
            info@neighborsos.org
          </a>
        </p>
      </div>
    </div>
  );
}