'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function NeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userZipCode, setUserZipCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Claim modal states
  const [selectedNeed, setSelectedNeed] = useState<any>(null);
  const [donorEmail, setDonorEmail] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorQuantity, setDonorQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['all', 'food', 'clothing', 'household items', 'medical', 'other'];

  // Share function
  function shareNeed(need: any) {
    const url = `https://neighborsos.org/needs`;
    const text = `Help ${need.charity} get ${need.item}! Only ${need.urgencyText} left. Support local charities on NeighborSOS.`;
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    
    const copyLink = () => {
      navigator.clipboard.writeText(`${text}\n\n${url}`);
      alert('Link copied to clipboard! Share it with your friends.');
    };
    
    const emailUrl = `mailto:?subject=${encodeURIComponent('Help Local Charities')}&body=${encodeURIComponent(text + '\n\n' + url)}`;
    
    return { facebookUrl, copyLink, emailUrl };
  }

  useEffect(() => {
    fetchNeeds();
  }, []);

  useEffect(() => {
    filterNeeds();
  }, [selectedCategory, searchQuery, needs]);

  async function fetchNeeds() {
    const { data } = await supabase
      .from('urgent_needs')
      .select(`
        *,
        charities (name, contact_email, zip_code, auto_response_message)
      `)
      .eq('status', 'available')
      .order('urgency_hours', { ascending: true });

    if (data) {
      const formattedNeeds = data.map((need: any) => ({
        id: need.id,
        charity: need.charities.name,
        charityId: need.charity_id,
        charityZipCode: need.charities.zip_code,
        charityEmail: need.charities.contact_email,
        charityAutoResponse: need.charities.auto_response_message,
        item: need.item_name,
        quantity: need.quantity,
        category: need.category || 'other',
        urgency: need.urgency_hours,
        urgencyText: `${need.urgency_hours} hours`,
        distance: '-- miles',
        notes: need.notes
      }));
      setNeeds(formattedNeeds);
      setFilteredNeeds(formattedNeeds);
    }
    setLoading(false);
  }

  function filterNeeds() {
    let filtered = needs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(need => 
        need.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(need =>
        need.charity.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNeeds(filtered);
  }

  async function calculateDistance(zip1: string, zip2: string): Promise<number> {
    try {
      const response1 = await fetch(`https://api.zippopotam.us/us/${zip1}`);
      const response2 = await fetch(`https://api.zippopotam.us/us/${zip2}`);
      
      if (!response1.ok || !response2.ok) return 999;
      
      const data1 = await response1.json();
      const data2 = await response2.json();
      
      const lat1 = parseFloat(data1.places[0].latitude);
      const lon1 = parseFloat(data1.places[0].longitude);
      const lat2 = parseFloat(data2.places[0].latitude);
      const lon2 = parseFloat(data2.places[0].longitude);
      
      const R = 3959;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return Math.round(distance * 10) / 10;
    } catch (error) {
      return 999;
    }
  }

  async function handleSortByDistance() {
    if (!userZipCode || userZipCode.length !== 5) {
      alert('Please enter a valid 5-digit zip code');
      return;
    }

    const needsWithDistance = await Promise.all(
      filteredNeeds.map(async (need) => {
        if (!need.charityZipCode) {
          return { ...need, calculatedDistance: 999, distance: '-- miles' };
        }
        const distance = await calculateDistance(userZipCode, need.charityZipCode);
        return { 
          ...need, 
          calculatedDistance: distance,
          distance: `${distance} miles`
        };
      })
    );

    const sorted = needsWithDistance.sort((a, b) => a.calculatedDistance - b.calculatedDistance);
    setFilteredNeeds(sorted);
  }

  async function handleClaimItem() {
    if (!donorEmail || !donorName || !selectedNeed) return;
    
    setIsSubmitting(true);
    
    const newQuantity = selectedNeed.quantity - donorQuantity;
    const isFullyFulfilled = newQuantity <= 0;
    
    const updateData: any = {
      quantity: Math.max(0, newQuantity)
    };
    
    if (isFullyFulfilled) {
      updateData.status = 'claimed';
      updateData.claimed_at = new Date().toISOString();
      updateData.claimed_by_email = donorEmail;
    }
    
    const { error } = await supabase
      .from('urgent_needs')
      .update(updateData)
      .eq('id', selectedNeed.id);
    
    if (error) {
      alert('Error claiming item. Please try again.');
      setIsSubmitting(false);
      return;
    }
    
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: donorEmail,
        subject: `Thank you for helping ${selectedNeed.charity}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000080;">Thank you for your generous donation, ${donorName}!</h2>
            <div style="background-color: #e8f4f8; border: 3px solid #000080; border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="font-size: 18px; margin: 0 0 10px 0; color: #333;">You've committed to donating:</p>
              <p style="font-size: 28px; font-weight: bold; color: #000080; margin: 0;">
                ${donorQuantity} ${selectedNeed.item}
              </p>
            </div>
            ${donorQuantity < selectedNeed.quantity ? `<p style="font-size: 14px; color: #666; text-align: center; margin: -15px 0 20px 0;">(${donorQuantity} of ${selectedNeed.quantity} total needed)</p>` : ''}
            <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #000080; margin-top: 0;">Next Steps from ${selectedNeed.charity}:</h3>
              <p style="line-height: 1.6;">
                ${(selectedNeed.charityAutoResponse || 'The charity will contact you within 24 hours with delivery instructions.').replace(/\n/g, '<br>')}
              </p>
            </div>
            <p style="font-size: 14px; color: #666;">
              Questions? Contact: <a href="mailto:${selectedNeed.charityEmail}">${selectedNeed.charityEmail}</a>
            </p>
            <p>- The NeighborSOS Team</p>
          </div>
        `
      })
    });

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: selectedNeed.charityEmail,
        subject: `${isFullyFulfilled ? 'Item Fully Claimed' : 'Partial Donation'}: ${selectedNeed.item}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${isFullyFulfilled ? '🎉 Fully fulfilled!' : '✅ Partial donation!'}</h2>
            <p><strong>Donor is providing:</strong> ${donorQuantity} ${selectedNeed.item}</p>
            ${!isFullyFulfilled ? `<p>Still needed: ${newQuantity}</p>` : ''}
            <h3>Donor Info:</h3>
            <ul>
              <li>Name: ${donorName}</li>
              <li>Email: ${donorEmail}</li>
            </ul>
          </div>
        `
      })
    });

    alert(`Thank you ${donorName}!\n\nYou've committed to donating:\n${donorQuantity} ${selectedNeed.item}\n\nCheck your email for next steps.`);
    
    await fetchNeeds();
    setSelectedNeed(null);
    setDonorEmail('');
    setDonorName('');
    setDonorQuantity(1);
    setIsSubmitting(false);
  }

  const getUrgencyColor = (hours: number) => {
    if (hours <= 12) return 'bg-red-100 text-red-800 border-red-300';
    if (hours <= 24) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (hours <= 48) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center">
        <p className="text-gray-600 text-xl">Loading needs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#2d3436] mb-3">
            Urgent Needs
          </h1>
          <p className="text-lg text-gray-600">
            Browse all current needs from verified local charities
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Charities
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Start typing charity name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {searchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {Array.from(new Set(needs.map(n => n.charity)))
                    .filter(charity => 
                      charity.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 8)
                    .map((charity, idx) => (
                      <button
                        key={`charity-${idx}`}
                        onClick={() => setSearchQuery(charity)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 last:rounded-b-lg first:rounded-t-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">{charity}</span>
                          <span className="text-xs text-gray-500">
                            {needs.filter(n => n.charity === charity).length} need{needs.filter(n => n.charity === charity).length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </button>
                    ))
                  }
                  
                  {Array.from(new Set(needs.map(n => n.charity)))
                    .filter(charity => 
                      charity.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No charities found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Zip Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userZipCode}
                  onChange={(e) => setUserZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="55101"
                  maxLength={5}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSortByDistance}
                  className="px-4 py-2 bg-[#000080] text-white rounded-lg hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
                >
                  Sort by Distance
                </button>
              </div>
            </div>

          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredNeeds.length} of {needs.length} needs
          </div>
        </div>

        {filteredNeeds.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-2xl text-gray-600 mb-2">No needs found</p>
            <p className="text-gray-500">Try adjusting your filters or search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNeeds.map((need) => (
              <div 
                key={need.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col"
              >
                <div className={`px-3 py-2 text-xs font-semibold border-b ${getUrgencyColor(need.urgency)}`}>
                  ⏰ {need.urgencyText} left
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[#2d3436] mb-2">
                    {need.item}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {need.charity}
                  </p>

                  <div className="space-y-2 mb-4 text-sm flex-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-semibold text-[#000080]">{need.quantity}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="capitalize text-gray-700">{need.category}</span>
                    </div>
                    
                    {need.distance !== '-- miles' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="text-gray-700">{need.distance}</span>
                      </div>
                    )}
                  </div>

                  {need.notes && (
                    <div className="bg-gray-50 rounded p-2 mb-4 text-xs text-gray-600 italic">
                      "{need.notes}"
                    </div>
                  )}

                  {/* Help & Share Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedNeed(need);
                        setDonorQuantity(1);
                      }}
                      className="flex-1 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                      style={{backgroundColor: '#FF8559'}}
                    >
                      Help Now →
                    </button>
                    
                    <div className="relative group">
                      <button
                        className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                        title="Share this need"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      
                      <div className="hidden group-hover:block absolute right-0 bottom-full mb-2 bg-white border-2 border-purple-500 rounded-lg shadow-xl p-3 w-48 z-10">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Share this need:</p>
                        <div className="space-y-2">
                          
                            href={shareNeed(need).facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                          <a>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Share on Facebook
                          </a>
                          
                          <button
                            onClick={shareNeed(need).copyLink}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-600 transition-colors w-full text-left"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                          </button>
                          
                          
                            href={shareNeed(need).emailUrl}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
                          <a>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Share via Email
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {selectedNeed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">Claim This Item</h2>
            
            <div className="mb-4 p-4 bg-blue-50 rounded">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-[#000080]">{selectedNeed.item}</h3>
                <span className="text-xs bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full capitalize">
                  {selectedNeed.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{selectedNeed.charity}</p>
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Quantity needed:</span> {selectedNeed.quantity}</p>
                <p><span className="font-medium">Urgency:</span> {selectedNeed.urgencyText} left</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many can you donate?
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDonorQuantity(Math.max(1, donorQuantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-xl"
                >
                  −
                </button>
                <input
                  type="number"
                  value={donorQuantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setDonorQuantity(Math.min(Math.max(1, val), selectedNeed.quantity));
                  }}
                  min="1"
                  max={selectedNeed.quantity}
                  className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => setDonorQuantity(Math.min(selectedNeed.quantity, donorQuantity + 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-xl"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">of {selectedNeed.quantity} needed</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedNeed(null);
                  setDonorEmail('');
                  setDonorName('');
                  setDonorQuantity(1);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClaimItem}
                disabled={!donorEmail || !donorName || isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold"
                style={{backgroundColor: '#FF8559'}}
              >
                {isSubmitting ? 'Claiming...' : 'Confirm & Help'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}