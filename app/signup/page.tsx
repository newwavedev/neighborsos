'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [charityName, setCharityName] = useState('');
  const [ein, setEin] = useState(''); // Tax ID
  const [contactEmail, setContactEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
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

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: contactEmail,
      password: password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // Create charity record
const { error: charityError } = await supabase
  .from('charities')
  .insert({
    name: charityName,
    contact_email: contactEmail,
    address: address,
    phone: phone,
    verified: false, // Admin needs to verify
    user_id: authData.user?.id,
  });

    if (charityError) {
      setError('Error creating charity profile. Please contact support.');
      setIsLoading(false);
      return;
    }

    alert('Account created! Your charity will be verified within 24-48 hours. You will receive an email when approved.');
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2] py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl p-8">
        
        <div className="relative mb-8">
          {/* X Close Button */}
          <button
            onClick={() => router.push('/')}
            className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-serif text-[#3a3a3a] mb-2">
              Register Your Charity
            </h1>
            <p className="text-gray-600">
              Join NeighborSOS to connect with local donors
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name *
            </label>
            <input
              type="text"
              value={charityName}
              onChange={(e) => setCharityName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="St. Mary's Shelter"
              required
            />
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    EIN (Tax ID)
  </label>
  <input
    type="text"
    value={ein}
    onChange={(e) => setEin(e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="12-3456789 (if applicable)"
  />
  <p className="text-xs text-gray-500 mt-1">
    For registered 501(c)(3) organizations. Leave blank for local/personal charitable efforts - we'll verify through alternative methods.
  </p>
</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="contact@charity.org"
              required
            />
          </div>

          <input
  type="tel"
  value={phone}
  onChange={(e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digits
    let formatted = '';
    
    if (input.length > 0) {
      formatted = '(' + input.substring(0, 3);
    }
    if (input.length >= 4) {
      formatted += ') ' + input.substring(3, 6);
    }
    if (input.length >= 7) {
      formatted += '-' + input.substring(6, 10);
    }
    
    setPhone(formatted);
  }}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="(555) 123-4567"
  maxLength={14}
/>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main St, Minneapolis, MN 55401"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
  <p className="font-medium mb-1">Verification Process:</p>
  <ul className="list-disc list-inside space-y-1 text-gray-600">
    <li>Your application will be reviewed within 24-48 hours</li>
    <li><strong>Registered nonprofits:</strong> We verify your EIN and 501(c)(3) status</li>
    <li><strong>Local charities:</strong> We verify through community references, social media, or direct contact</li>
    <li>You'll receive an email when approved</li>
  </ul>
</div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            style={{backgroundColor: '#000080', color: 'white'}}
          >
            {isLoading ? 'Creating Account...' : 'Submit Application'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </a>
        </p>

      </div>
    </div>
  );
}