'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [pendingCharities, setPendingCharities] = useState<any[]>([]);
  const [verifiedCharities, setVerifiedCharities] = useState<any[]>([]);
  
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

  // Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      
      // Check if user is in admins table
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!adminData) {
        alert('Access denied. Admin privileges required.');
        router.push('/');
        return;
      }
      
      setIsAdmin(true);
      setLoading(false);
    }
    
    checkAdmin();
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchCharities();
    fetchStats();
  }, [isAdmin]);

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
  }

  async function fetchStats() {
    // Total charities
    const { count: totalCharities } = await supabase
      .from('charities')
      .select('*', { count: 'exact', head: true });
    
    // Pending charities
    const { count: pendingCount } = await supabase
      .from('charities')
      .select('*', { count: 'exact', head: true })
      .eq('verified', false);
    
    // Verified charities
    const { count: verifiedCount } = await supabase
      .from('charities')
      .select('*', { count: 'exact', head: true })
      .eq('verified', true);
    
    // Total needs
    const { count: totalNeeds } = await supabase
      .from('urgent_needs')
      .select('*', { count: 'exact', head: true });
    
    // Claimed needs
    const { count: claimedNeeds } = await supabase
      .from('urgent_needs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'claimed');
    
    // Total families
    const { count: totalFamilies } = await supabase
      .from('adopt_a_family')
      .select('*', { count: 'exact', head: true });
    
    // Fully funded families
    const { count: fullyFundedFamilies } = await supabase
      .from('adopt_a_family')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'fully_adopted');
    
    setStats({
      totalCharities: totalCharities || 0,
      pendingCharities: pendingCount || 0,
      verifiedCharities: verifiedCount || 0,
      totalNeeds: totalNeeds || 0,
      claimedNeeds: claimedNeeds || 0,
      totalFamilies: totalFamilies || 0,
      fullyFundedFamilies: fullyFundedFamilies || 0,
    });
  }

  async function handleApprove(charityId: string, charityName: string, charityEmail: string) {
    if (!confirm('Approve this charity?')) return;

    const { error } = await supabase
      .from('charities')
      .update({ verified: true })
      .eq('id', charityId);

    if (!error) {
      // Send approval email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: charityEmail,
          subject: '🎉 Your NeighborSOS Charity Account is Approved!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #000080;">Congratulations! You're Verified! 🎉</h2>
              <p>Great news, <strong>${charityName}</strong>!</p>
              <p>Your charity account has been verified and approved. You can now:</p>
              <ul>
                <li>Post urgent needs to the platform</li>
                <li>Connect with local donors</li>
                <li>Manage your posted needs</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://neighborsos.org/login" 
                   style="background-color: #000080; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Log In to Your Dashboard
                </a>
              </div>
              <p>Questions? Reply to this email.</p>
              <p>- The NeighborSOS Team</p>
            </div>
          `
        })
      });
      
      alert('Charity approved and notified!');
      fetchCharities();
      fetchStats();
    }
  }

  async function handleReject(charityId: string, charityEmail: string, charityName: string) {
    const reason = prompt('Reason for rejection (optional - will be sent to charity):');
    
    if (!confirm('Reject and delete this charity application?')) return;

    const { error } = await supabase
      .from('charities')
      .delete()
      .eq('id', charityId);

    if (!error) {
      // Send rejection email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: charityEmail,
          subject: 'NeighborSOS Application Update',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Application Status Update</h2>
              <p>Dear ${charityName},</p>
              <p>Thank you for your interest in NeighborSOS.</p>
              <p>Unfortunately, we're unable to approve your application at this time.</p>
              ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
              <p>If you have questions or would like to reapply, please contact us at info@neighborsos.org</p>
              <p>- The NeighborSOS Team</p>
            </div>
          `
        })
      });
      
      alert('Charity rejected and notified.');
      fetchCharities();
      fetchStats();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-8 py-12 max-w-6xl">
        
        {/* Header with Sign Out */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-serif text-[#3a3a3a] mb-3">Admin Dashboard</h1>
            <p className="text-lg" style={{color: '#8B8589'}}>
              Manage charity applications and view platform statistics
            </p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Total Charities</div>
            <div className="text-3xl font-bold text-[#000080]">{stats.totalCharities}</div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.pendingCharities} pending approval
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Urgent Needs</div>
            <div className="text-3xl font-bold text-[#FF8559]">{stats.totalNeeds}</div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.claimedNeeds} claimed
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Families</div>
            <div className="text-3xl font-bold text-[#667eea]">{stats.totalFamilies}</div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.fullyFundedFamilies} fully funded
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Verified Charities</div>
            <div className="text-3xl font-bold text-[#00b894]">{stats.verifiedCharities}</div>
            <div className="text-xs text-gray-500 mt-2">
              Active on platform
            </div>
          </div>
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
                      <p className="text-xs text-gray-500 mt-1">
                        Applied: {new Date(charity.created_at).toLocaleDateString()}
                      </p>
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
                    <div>
                      <span className="font-medium text-gray-700">EIN:</span>
                      <p className="text-gray-600">{charity.ein || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Zip Code:</span>
                      <p className="text-gray-600">{charity.zip_code}</p>
                    </div>
                  </div>

                  {charity.auto_response_message && (
                    <div className="mb-4 p-3 bg-white rounded text-xs">
                      <strong className="text-gray-700">Auto-response message:</strong>
                      <p className="text-gray-600 mt-1">{charity.auto_response_message}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(charity.id, charity.name, charity.contact_email)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(charity.id, charity.contact_email, charity.name)}
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
                      <p className="text-sm text-gray-600">{charity.contact_email} · {charity.phone || 'No phone'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Verified: {new Date(charity.created_at).toLocaleDateString()}
                      </p>
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