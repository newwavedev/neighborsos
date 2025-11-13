'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ManageFamiliesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [charities, setCharities] = useState<any[]>([]);
  const [myFamilies, setMyFamilies] = useState<any[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<string>('');
  
  // Form states
  const [familyName, setFamilyName] = useState('');
  const [familySize, setFamilySize] = useState('4');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('2');
  const [childrenAges, setChildrenAges] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('300');
  const [specificNeeds, setSpecificNeeds] = useState('');
  const [story, setStory] = useState('');
  const [urgencyDate, setUrgencyDate] = useState('2025-12-25');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        setLoading(false);
      }
    }
    
    checkUser();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    
    async function fetchMyCharity() {
      const { data } = await supabase
        .from('charities')
        .select('*')
        .eq('user_id', user.id);
      
      if (data && data.length > 0) {
        setCharities(data);
        setSelectedCharity(data[0].id);
      }
    }
    fetchMyCharity();
  }, [user]);

  useEffect(() => {
    if (!selectedCharity) return;
    
    async function fetchMyFamilies() {
      const { data } = await supabase
        .from('adopt_a_family')
        .select('*, family_adoptions(*)')
        .eq('charity_id', selectedCharity)
        .order('created_at', { ascending: false });
      
      if (data) setMyFamilies(data);
    }
    fetchMyFamilies();
  }, [selectedCharity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCharity || !familyName) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from('adopt_a_family')
      .insert({
        charity_id: selectedCharity,
        family_name: familyName,
        family_size: parseInt(familySize),
        adults: parseInt(adults),
        children: parseInt(children),
        children_ages: childrenAges || null,
        estimated_cost: parseInt(estimatedCost),
        specific_needs: specificNeeds,
        story: story || null,
        urgency_date: urgencyDate,
        status: 'available'
      });

    if (error) {
      alert('Error adding family. Please try again.');
    } else {
      alert('Family added successfully!');
      // Clear form
      setFamilyName('');
      setFamilySize('4');
      setAdults('2');
      setChildren('2');
      setChildrenAges('');
      setEstimatedCost('300');
      setSpecificNeeds('');
      setStory('');
      
      // Refresh list
      const { data } = await supabase
        .from('adopt_a_family')
        .select('*, family_adoptions(*)')
        .eq('charity_id', selectedCharity)
        .order('created_at', { ascending: false });
      
      if (data) setMyFamilies(data);
    }

    setIsSubmitting(false);
  }

  async function handleDelete(familyId: string) {
    if (!confirm('Are you sure you want to remove this family?')) return;

    const { error } = await supabase
      .from('adopt_a_family')
      .delete()
      .eq('id', familyId);

    if (!error) {
      setMyFamilies(myFamilies.filter(f => f.id !== familyId));
      alert('Family removed successfully!');
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#2d3436] mb-2">
                ✨ Manage Holiday Families
              </h1>
              <p className="text-base md:text-lg text-gray-600">
                Add families for the Sponsor a Family program
              </p>
            </div>
            <div className="flex gap-3">
              
              <a  href="/charities"
                className="px-4 py-2 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
              >
                ← Back to Dashboard
              </a>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }}
                className="px-4 py-2 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Organization Display */}
        {charities[0] && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Organization
                </label>
                <div className="text-2xl font-serif text-[#2d3436]">
                  {charities[0].name}
                </div>
              </div>
              {!charities[0].verified && (
                <span className="bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                  PENDING VERIFICATION
                </span>
              )}
            </div>
          </div>
        )}

        {selectedCharity && charities[0]?.verified ? (
          <>
            {/* Add Family Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-purple-500">
              <h2 className="text-2xl font-serif text-[#2d3436] mb-4">Add a Family for Sponsorship</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family Name *
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., The Johnson Family"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use anonymous names to protect privacy (e.g., "Family A" or "The Smith Family")
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Family Size *
                    </label>
                    <input
                      type="number"
                      value={familySize}
                      onChange={(e) => setFamilySize(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adults
                    </label>
                    <input
                      type="number"
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Children
                    </label>
                    <input
                      type="number"
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Children Ages (optional)
                  </label>
                  <input
                    type="text"
                    value={childrenAges}
                    onChange={(e) => setChildrenAges(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 3, 7, 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Total Cost ($) *
                  </label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Approximate cost to fully support this family's holiday needs
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specific Needs *
                  </label>
                  <textarea
                    value={specificNeeds}
                    onChange={(e) => setSpecificNeeds(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="e.g., Winter clothing (coats, boots), toys for ages 3-10, grocery gift cards, household essentials"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family Story (optional)
                  </label>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    maxLength={300}
                    placeholder="Brief anonymous description of their situation (e.g., 'Single parent working two jobs to support three children')"
                  />
                  <p className="text-xs text-gray-500 mt-1">{story.length}/300 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date (e.g., December 25)
                  </label>
                  <input
                    type="date"
                    value={urgencyDate}
                    onChange={(e) => setUrgencyDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                >
                  {isSubmitting ? 'Adding...' : '✨ Add Family to Program'}
                </button>
              </form>
            </div>

            {/* My Families List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-serif text-[#2d3436] mb-4">My Posted Families</h2>
              
              {myFamilies.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No families posted yet.</p>
              ) : (
                <div className="space-y-4">
                  {myFamilies.map(family => {
                    const percentFunded = Math.min(100, (family.amount_committed / family.estimated_cost) * 100);
                    const remaining = Math.max(0, family.estimated_cost - family.amount_committed);
                    
                    return (
                      <div 
                        key={family.id}
                        className="border rounded-lg p-4"
                        style={{borderColor: family.status === 'fully_adopted' ? '#00b894' : '#e5e4e2'}}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#2d3436] text-lg">{family.family_name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Family of {family.family_size} • Est. Cost: ${family.estimated_cost}
                            </p>
                          </div>
                          {family.status === 'available' && (
                            <button
                              onClick={() => handleDelete(family.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium ml-4">
                            
                              Delete
                            </button>
                          )}
                        </div>

                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-[#00b894]">
                              ${family.amount_committed} raised
                            </span>
                            <span className="text-gray-600">
                              {remaining > 0 ? `$${remaining} needed` : 'Fully funded! ✨'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${percentFunded}%`,
                                backgroundColor: family.status === 'fully_adopted' ? '#00b894' : '#667eea'
                              }}
                            />
                          </div>
                        </div>

                        {/* Donors */}
                        {family.family_adoptions && family.family_adoptions.length > 0 && (
                          <div className="bg-green-50 rounded p-3 mt-3">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Donors ({family.family_adoptions.length}):
                            </p>
                            {family.family_adoptions.map((adoption: any, idx: number) => (
                              <p key={idx} className="text-xs text-gray-600">
                                • {adoption.donor_name} - ${adoption.amount_committed} ({adoption.donor_email})
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : selectedCharity && !charities[0]?.verified ? (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
            <h3 className="font-semibold text-amber-900 mb-2">Account Pending Verification</h3>
            <p className="text-amber-800">
              Your charity application is being reviewed. Once approved, you'll be able to add families to the Sponsor a Family program.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
}