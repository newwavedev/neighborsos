'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CharitiesPage() {
  const router = useRouter();
  
  // All state declarations together
  const [charities, setCharities] = useState<any[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<string>('');
  const [itemName, setItemName] = useState('');
const [quantity, setQuantity] = useState('1');
const [category, setCategory] = useState('');
const [urgencyHours, setUrgencyHours] = useState('24');
const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myNeeds, setMyNeeds] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ALL useEffect hooks together - NO early returns before these
  
  // Check auth first
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

  // Fetch only THIS user's charity
  useEffect(() => {
    if (!user) return;
    
    async function fetchMyCharity() {
      const { data, error } = await supabase
        .from('charities')
        .select('*')
        .eq('user_id', user.id);
      
      if (data && data.length > 0) {
        setCharities(data);
        setSelectedCharity(data[0].id);
      } else {
        console.log('No charity found for user:', user.id, error);
      }
    }
    fetchMyCharity();
  }, [user]);

  // Fetch needs when charity is selected
  useEffect(() => {
    if (!selectedCharity) return;
    
    async function fetchMyNeeds() {
      const { data } = await supabase
        .from('urgent_needs')
        .select('*')
        .eq('charity_id', selectedCharity)
        .order('created_at', { ascending: false });
      
      if (data) setMyNeeds(data);
    }
    fetchMyNeeds();
  }, [selectedCharity]);

  // NOW we can have the early return - after ALL hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCharity || !itemName) return;

    setIsSubmitting(true);

    const { error } = await supabase
  .from('urgent_needs')
  .insert({
    charity_id: selectedCharity,
    item_name: itemName,
    quantity: parseInt(quantity),
    category: category,
    urgency_hours: parseInt(urgencyHours),
    notes: notes,
    status: 'available'
  });

    if (error) {
      alert('Error adding item. Please try again.');
    } else {
      alert('Item added successfully!');
      setItemName('');
setQuantity('1');
setCategory('');
setUrgencyHours('24');
setNotes('');
      
      const { data } = await supabase
        .from('urgent_needs')
        .select('*')
        .eq('charity_id', selectedCharity)
        .order('created_at', { ascending: false });
      
      if (data) setMyNeeds(data);
    }

    setIsSubmitting(false);
  }

  async function handleDelete(needId: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase
      .from('urgent_needs')
      .delete()
      .eq('id', needId);

    if (!error) {
      setMyNeeds(myNeeds.filter(need => need.id !== needId));
      alert('Item deleted successfully!');
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-8 py-12 max-w-4xl">
        
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-serif text-[#3a3a3a] mb-3">
              Charity Dashboard
            </h1>
            <p className="text-lg" style={{color: '#8B8589'}}>
              Post urgent needs for your organization
            </p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Organization
          </label>
          <div className="flex justify-between items-center">
            <div className="text-2xl font-serif text-[#000080]">
              {charities[0]?.name || 'Loading...'}
            </div>
            {charities[0] && !charities[0].verified && (
              <span className="bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                PENDING VERIFICATION
              </span>
            )}
          </div>
        </div>

        {selectedCharity && !charities[0]?.verified && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-6">
            <h3 className="font-semibold text-amber-900 mb-2">Account Pending Verification</h3>
            <p className="text-amber-800">
              Your charity application is being reviewed. You'll receive an email within 24-48 hours once approved. 
              After approval, you'll be able to post urgent needs to the platform.
            </p>
          </div>
        )}

        {selectedCharity && charities[0]?.verified && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-[#000080]">
              <h2 className="text-2xl font-serif text-[#3a3a3a] mb-4">Add New Urgent Need</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Item Needed *
    </label>
    <input
      type="text"
      value={itemName}
      onChange={(e) => setItemName(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="e.g., Winter Coats (Adult sizes)"
      required
    />
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Quantity *
      </label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        min="1"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category *
      </label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      >
        <option value="">Select category</option>
        <option value="clothing">Clothing</option>
        <option value="food">Food</option>
        <option value="household">Household Items</option>
        <option value="vet">Vet Help</option>
        <option value="misc">Miscellaneous</option>
      </select>
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Urgency (hours) *
    </label>
    <input
      type="number"
      value={urgencyHours}
      onChange={(e) => setUrgencyHours(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      min="1"
      max="168"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Additional Notes
    </label>
    <textarea
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Any important details about the items..."
      maxLength={150}
      rows={3}
    />
    <p className="text-xs text-gray-500 mt-1">{notes.length}/150 characters</p>
  </div>

  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
    style={{backgroundColor: '#000080', color: 'white'}}
  >
    {isSubmitting ? 'Adding...' : 'Add Urgent Need'}
  </button>
</form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-serif text-[#3a3a3a] mb-4">My Posted Needs</h2>
              
              {myNeeds.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No urgent needs posted yet.</p>
              ) : (
                <div className="space-y-3">
                  {myNeeds.map(need => (
  <div 
    key={need.id}
    className="border rounded-lg p-4 flex justify-between items-start"
    style={{borderColor: need.status === 'claimed' ? '#ADEBB3' : '#e5e4e2'}}
  >
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-medium text-[#3a3a3a]">{need.item_name}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize">
          {need.category}
        </span>
      </div>
      <p className="text-sm text-gray-500">
        Qty: {need.quantity} · {need.urgency_hours} hours · 
        <span className={need.status === 'claimed' ? 'text-green-600 font-medium' : 'text-gray-600'}>
          {' '}{need.status === 'claimed' ? 'CLAIMED' : 'Available'}
        </span>
      </p>
      {need.notes && (
        <p className="text-xs text-gray-600 mt-2 italic bg-gray-50 p-2 rounded">"{need.notes}"</p>
      )}
      {need.claimed_by_email && (
        <p className="text-xs text-gray-500 mt-2">
          Claimed by: {need.claimed_by_email}
        </p>
      )}
    </div>
                      
                      {need.status === 'available' && (
                        <button
                          onClick={() => handleDelete(need.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}