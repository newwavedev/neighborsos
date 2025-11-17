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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight">
            NeighborSOS
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-600 to-orange-500 mx-auto"></div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 text-center leading-tight">
            Launching Soon
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto leading-relaxed">
            We're building a platform that connects local charities with donors who want to make a direct, transparent impact on families in need.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-10">
            <p className="text-base text-gray-800 leading-relaxed">
              Our platform will enable you to sponsor specific family needs—from winter coats and toys to groceries—with complete transparency about where your donation goes and who it helps.
            </p>
          </div>

          {!submitted ? (
            <>
              <p className="text-gray-700 text-center mb-6 font-medium">
                Be notified when we launch
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                    className="flex-1 px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loading ? 'Submitting...' : 'Notify Me'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
              <p className="text-green-800 text-lg font-semibold">
                Thank you for your interest! We'll notify you when we launch.
              </p>
            </div>
          )}

          {/* Features */}
          <div className="mt-14 pt-10 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Simple
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Sponsor a family need in just a few clicks
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Direct
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  100% of your donation goes to the family
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Transparent
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  See exactly who you're helping
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-center mt-10 text-sm">
          Questions? Contact us at{' '}
          <a 
            href="mailto:info@neighborsos.org" 
            className="text-orange-600 hover:text-orange-700 underline decoration-orange-300 hover:decoration-orange-500 transition-colors"
          >
            info@neighborsos.org
          </a>
        </p>
      </div>
    </div>
  );
}