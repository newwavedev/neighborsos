'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Charities data
  const [charities, setCharities] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'verified' | 'all'>('pending');
  
  // Statistics
  const [stats, setStats] = useState({
    totalCharities: 0,
    pendingCharities: 0,
    verifiedCharities: 0,
    totalNeeds: 0,
    claimedNeeds: 0,
    totalFamilies: 0,
    fullyFundedFamilies: 0,
  });

  // Check if user is admin - IMPROVED VERSION
  useEffect(() => {
    async function checkAdmin() {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        console.log('User check:', user); // Debug log
        
        if (userError || !user) {
          console.log('No user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        setUser(user);
        
        // Check if user is in admins table
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        console.log('Admin check:', adminData, adminError); // Debug log
        
        if (adminError || !adminData) {
          console.log('Not an admin');
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          // Don't redirect, just show error message
          return;
        }
        
        console.log('Admin verified!');
        setIsAdmin(true);
        setLoading(false);
        
        // Load data
        fetchCharities();
        fetchStats();
      } catch (err) {
        console.error('Error in checkAdmin:', err);
        setError('An error occurred. Please try again.');
        setLoading(false);
      }
    }
    
    checkAdmin();
  }, [router]);

  // Fetch charities
  async function fetchCharities() {
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setCharities(data);
    }
  }

  // Fetch statistics
  async function fetchStats() {
    const { data: charities } = await supabase.from('charities').select('*');
    const { data: needs } = await supabase.from('family_needs').select('*');
    
    if (charities) {
      setStats(prev => ({
        ...prev,
        totalCharities: charities.length,
        pendingCharities: charities.filter(c => !c.is_verified).length,
        verifiedCharities: charities.filter(c => c.is_verified).length,
      }));
    }
    
    if (needs) {
      const totalFamilies = new Set(needs.map(n => n.family_id)).size;
      const claimedNeeds = needs.filter(n => n.claimed_by).length;
      
      // Count fully funded families
      const familyFunding = needs.reduce((acc, need) => {
        if (!acc[need.family_id]) {
          acc[need.family_id] = { total: 0, claimed: 0 };
        }
        acc[need.family_id].total++;
        if (need.claimed_by) acc[need.family_id].claimed++;
        return acc;
      }, {} as any);
      
      const fullyFunded = Object.values(familyFunding).filter(
        (f: any) => f.total === f.claimed
      ).length;
      
      setStats(prev => ({
        ...prev,
        totalNeeds: needs.length,
        claimedNeeds,
        totalFamilies,
        fullyFundedFamilies: fullyFunded,
      }));
    }
  }

  // Add this to your state variables at the top
const [whitelistEmails, setWhitelistEmails] = useState<any[]>([]);
const [newEmail, setNewEmail] = useState('');
const [newNotes, setNewNotes] = useState('');

// Add this function with your other functions
async function fetchWhitelist() {
  const { data } = await supabase
    .from('early_access')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (data) {
    setWhitelistEmails(data);
  }
}

async function addToWhitelist(e: React.FormEvent) {
  e.preventDefault();
  
  const { error } = await supabase
    .from('early_access')
    .insert([{ email: newEmail, notes: newNotes }]);
  
  if (!error) {
    alert('Email added to early access list!');
    setNewEmail('');
    setNewNotes('');
    fetchWhitelist();
  } else {
    alert('Error: ' + error.message);
  }
}

async function removeFromWhitelist(id: string) {
  if (!confirm('Remove this email from early access?')) return;
  
  const { error } = await supabase
    .from('early_access')
    .delete()
    .eq('id', id);
  
  if (!error) {
    alert('Email removed!');
    fetchWhitelist();
  }
}

// Update your useEffect to fetch whitelist
useEffect(() => {
  async function checkAdmin() {
    // ... existing code ...
    
    if (isAdmin) {
      fetchCharities();
      fetchStats();
      fetchWhitelist(); // Add this line
    }
  }
  
  checkAdmin();
}, [router]);

  // Approve charity
  async function approveCharity(charityId: string) {
    const { error } = await supabase
      .from('charities')
      .update({ is_verified: true })
      .eq('id', charityId);
    
    if (!error) {
      alert('Charity approved!');
      fetchCharities();
      fetchStats();
    }
  }

  // Reject charity
  async function rejectCharity(charityId: string) {
    if (!confirm('Are you sure you want to reject this charity?')) return;
    
    const { error } = await supabase
      .from('charities')
      .delete()
      .eq('id', charityId);
    
    if (!error) {
      alert('Charity rejected and removed.');
      fetchCharities();
      fetchStats();
    }
  }

  // Filter charities based on selected tab
  const filteredCharities = charities.filter(charity => {
    if (selectedTab === 'pending') return !charity.is_verified;
    if (selectedTab === 'verified') return charity.is_verified;
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Error state (Access Denied)
  if (error || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            {error || 'You need admin privileges to access this page.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
            >
              Go to Login
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Go to Home
            </button>
          </div>
          {user && (
            <p className="mt-4 text-sm text-gray-500">
              Logged in as: {user.email}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Charities</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCharities}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending Approval</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingCharities}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Verified Charities</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.verifiedCharities}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Families</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalFamilies}</p>
          </div>
        </div>

        {/* Early Access Whitelist Management */}
<div className="bg-white rounded-lg shadow mb-6 p-6">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">Early Access Whitelist</h2>
  <p className="text-gray-600 mb-6">
    Add email addresses that can access the site before launch. They must log in to bypass the coming soon page.
  </p>
  
  {/* Add Email Form */}
  <form onSubmit={addToWhitelist} className="mb-6 pb-6 border-b border-gray-200">
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="charity@example.com"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optional)
        </label>
        <input
          type="text"
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          placeholder="e.g., ABC Charity - Demo access"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
    <button
      type="submit"
      className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700"
    >
      Add to Whitelist
    </button>
  </form>
  
  {/* Whitelist Table */}
  <div>
    <h3 className="font-semibold text-gray-900 mb-3">
      Current Whitelist ({whitelistEmails.length})
    </h3>
    {whitelistEmails.length === 0 ? (
      <p className="text-gray-500 italic">No emails in whitelist yet.</p>
    ) : (
      <div className="space-y-2">
        {whitelistEmails.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div>
              <p className="font-medium text-gray-900">{item.email}</p>
              {item.notes && <p className="text-sm text-gray-500">{item.notes}</p>}
              <p className="text-xs text-gray-400">Added: {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => removeFromWhitelist(item.id)}
              className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setSelectedTab('pending')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'pending'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({stats.pendingCharities})
              </button>
              <button
                onClick={() => setSelectedTab('verified')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'verified'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Verified ({stats.verifiedCharities})
              </button>
              <button
                onClick={() => setSelectedTab('all')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'all'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Charities ({stats.totalCharities})
              </button>
            </nav>
          </div>

          {/* Charities List */}
          <div className="p-6">
            {filteredCharities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No charities found.</p>
            ) : (
              <div className="space-y-4">
                {filteredCharities.map((charity) => (
                  <div key={charity.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{charity.name}</h3>
                          {charity.is_verified ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Verified
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{charity.description}</p>
                        <div className="text-sm text-gray-500">
                          <p><strong>Contact:</strong> {charity.contact_name}</p>
                          <p><strong>Email:</strong> {charity.contact_email}</p>
                          <p><strong>Phone:</strong> {charity.contact_phone}</p>
                          {charity.website && <p><strong>Website:</strong> <a href={charity.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">{charity.website}</a></p>}
                          <p className="mt-2"><strong>Created:</strong> {new Date(charity.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {!charity.is_verified && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => approveCharity(charity.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectCharity(charity.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}