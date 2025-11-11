'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [pendingCharities, setPendingCharities] = useState<any[]>([]);
  const [verifiedCharities, setVerifiedCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharities();
  }, []);

  async function fetchCharities() {
    // Fetch pending charities
    const { data: pending } = await supabase
      .from('charities')
      .select('*')
      .eq('verified', false)
      .order('created_at', { ascending: false });
    
    if (pending) setPendingCharities(pending);

    // Fetch verified charities
    const { data: verified } = await supabase
      .from('charities')
      .select('*')
      .eq('verified', true)
      .order('name');
    
    if (verified) setVerifiedCharities(verified);
    
    setLoading(false);
  }

  async function handleApprove(charityId: string) {
    if (!confirm('Approve this charity?')) return;

    const { error } = await supabase
      .from('charities')
      .update({ verified: true })
      .eq('id', charityId);

    if (!error) {
      alert('Charity approved!');
      fetchCharities(); // Refresh list
    }
  }

  async function handleReject(charityId: string) {
    if (!confirm('Reject and delete this charity application?')) return;

    const { error } = await supabase
      .from('charities')
      .delete()
      .eq('id', charityId);

    if (!error) {
      alert('Charity rejected and removed.');
      fetchCharities(); // Refresh list
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-8 py-12 max-w-6xl">
        
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-[#3a3a3a] mb-3">Admin Dashboard</h1>
          <p className="text-lg" style={{color: '#8B8589'}}>
            Manage charity applications and verifications
          </p>
        </div>

        {/* Pending Charities */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-serif text-[#3a3a3a] mb-4">
            Pending Verification ({pendingCharities.length})
          </h2>
          
          {pendingCharities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending applications</p>
          ) : (
            <div className="space-y-4">
              {pendingCharities.map(charity => (
                <div key={charity.id} className="border border-amber-300 bg-amber-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#3a3a3a]">{charity.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{charity.address}</p>
                    </div>
                    <span className="bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                      PENDING
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{charity.contact_email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-600">{charity.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(charity.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(charity.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verified Charities */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-serif text-[#3a3a3a] mb-4">
            Verified Charities ({verifiedCharities.length})
          </h2>
          
          {verifiedCharities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No verified charities yet</p>
          ) : (
            <div className="space-y-3">
              {verifiedCharities.map(charity => (
                <div key={charity.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#3a3a3a]">{charity.name}</h3>
                      <p className="text-sm text-gray-600">{charity.contact_email} · {charity.phone}</p>
                    </div>
                    <span className="bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                      VERIFIED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}