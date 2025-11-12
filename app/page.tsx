'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';


export default function Home() {
  const [isScrolling, setIsScrolling] = useState(true);
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State for data from database
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [currentNeeds, setCurrentNeeds] = useState<any[]>([]);
  
  // State for claim modal
  const [selectedNeed, setSelectedNeed] = useState<any>(null);
  const [donorEmail, setDonorEmail] = useState('');
  const [userZipCode, setUserZipCode] = useState('');
  const [donorName, setDonorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donorQuantity, setDonorQuantity] = useState(1);

  // Calculate distance between two zip codes using Haversine formula
async function calculateDistance(zip1: string, zip2: string): Promise<number> {
  try {
    // Fetch coordinates for both zip codes from free API
    const response1 = await fetch(`https://api.zippopotam.us/us/${zip1}`);
    const response2 = await fetch(`https://api.zippopotam.us/us/${zip2}`);
    
    if (!response1.ok || !response2.ok) return 999; // Return large distance if zip not found
    
    const data1 = await response1.json();
    const data2 = await response2.json();
    
    const lat1 = parseFloat(data1.places[0].latitude);
    const lon1 = parseFloat(data1.places[0].longitude);
    const lat2 = parseFloat(data2.places[0].latitude);
    const lon2 = parseFloat(data2.places[0].longitude);
    
    // Haversine formula to calculate distance in miles
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 999;
  }
}
  
  // Auto-scroll effect for urgent needs (desktop only)
useEffect(() => {
  // Disable auto-scroll on mobile
  if (window.innerWidth < 768) return;
  
  if (!isScrolling || !scrollRef.current) return;
    
    const scrollContainer = scrollRef.current;
    const scrollInterval = setInterval(() => {
      if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
        scrollContainer.scrollTop = 0;
      } else {
        scrollContainer.scrollTop += 1;
      }
    }, 50);

    return () => clearInterval(scrollInterval);
  }, [isScrolling]);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      // Fetch success stories
      const { data: stories } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (stories) {
        // Map to match your component's format
        const formattedStories = stories.map((story: any, index: number) => ({
          id: story.id,
          name: story.name,
          story: story.story,
          accent: story.accent_color,
          height: ['h-[420px]', 'h-[480px]', 'h-[400px]', 'h-[460px]', 'h-[440px]', 'h-[390px]', 'h-[470px]', 'h-[430px]'][index % 8],
          image: story.image_url.replace('.jpg', '')
        }));
        setSuccessStories(formattedStories);
      }

      // Fetch urgent needs with charity info
      const { data: needs } = await supabase
  .from('urgent_needs')
  .select(`
    *,
    charities (name, zip_code)
  `)
  .eq('status', 'available')
  .order('urgency_hours', { ascending: true });

if (needs) {
  const formattedNeeds = needs.map((need: any) => ({
    id: need.id,
    charity: need.charities.name,
    charityId: need.charity_id,
    charityZipCode: need.charities.zip_code,
    item: need.item_name,
    quantity: need.quantity,
    category: need.category,
    urgency: `${need.urgency_hours} hours`,
    distance: '-- miles',
    notes: need.notes
  }));
  setCurrentNeeds(formattedNeeds);
}
    }

    fetchData();
  }, []);

  async function handleClaimItem() {
  if (!donorEmail || !donorName || !selectedNeed) return;
  
  setIsScrolling(false);
  setIsSubmitting(true);
  
  // Get charity details including auto-response message
  const { data: charity } = await supabase
    .from('charities')
    .select('auto_response_message, contact_email, name')
    .eq('id', selectedNeed.charityId)
    .single();
  
  // Calculate new quantity
  const newQuantity = selectedNeed.quantity - donorQuantity;
  const isFullyFulfilled = newQuantity <= 0;
  
  // Update the item in database
  const updateData: any = {
    quantity: Math.max(0, newQuantity)
  };
  
  // If fully fulfilled, mark as claimed
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
  
  // Send email to donor with charity's auto-response
  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: donorEmail,
      subject: `Thank you for helping ${charity?.name || selectedNeed.charity}!`,
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
      <h3 style="color: #000080; margin-top: 0;">Next Steps from ${charity?.name || selectedNeed.charity}:</h3>
      <p style="line-height: 1.6;">
        ${(charity?.auto_response_message || 'The charity will contact you within 24 hours with delivery instructions.').replace(/\n/g, '<br>')}
      </p>
    </div>
    
    <p style="font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px;">
      Questions? Contact the charity directly at: <a href="mailto:${charity?.contact_email}" style="color: #000080;">${charity?.contact_email}</a>
    </p>
    
    <p>Thank you for making a difference in your community!</p>
    <p style="color: #666;">- The NeighborSOS Team<br>
    <a href="https://neighborsos.org" style="color: #000080;">neighborsos.org</a></p>
    
    <p style="font-size: 11px; color: #999; margin-top: 30px;">
      You received this email because you claimed an item on NeighborSOS.org. This is a transactional email related to your donation commitment.
    </p>
  </div>

      `
    })
  });
  
  // Send notification email to charity
  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: charity?.contact_email,
      subject: `${isFullyFulfilled ? 'Item Fully Claimed' : 'Partial Donation Received'}: ${selectedNeed.item}`,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>${isFullyFulfilled ? '🎉 Great news! Your need is fully fulfilled.' : '✅ Good news! Someone is donating!'}</h2>
    
    <div style="background-color: #fff3e6; border: 3px solid #FF8559; border-radius: 10px; padding: 20px; margin: 25px 0;">
      <p style="font-size: 16px; margin: 0 0 10px 0; color: #666;">A donor is providing:</p>
      <p style="font-size: 24px; font-weight: bold; color: #FF8559; margin: 10px 0;">
        ${donorQuantity} ${selectedNeed.item}
      </p>
      ${!isFullyFulfilled ? `<p style="font-size: 14px; color: #666; margin: 10px 0;">Still needed: ${newQuantity} more</p>` : `<p style="font-size: 14px; color: green; font-weight: bold; margin: 10px 0;">✓ This need is now fully met!</p>`}
      <p style="font-size: 14px; color: #666; margin: 5px 0;"><strong>Category:</strong> ${selectedNeed.category}</p>
    </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <h3>Donor Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${donorName}</li>
            <li><strong>Email:</strong> ${donorEmail}</li>
          </ul>
          <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #FF8559; margin: 15px 0;">
            <strong>Your auto-response has been sent to the donor.</strong> They have your delivery/drop-off instructions. You may also reach out directly if needed.
          </div>
          ${!isFullyFulfilled ? '<p style="color: #000080; font-weight: bold;">This item is still active on NeighborSOS with the updated quantity.</p>' : '<p style="color: green; font-weight: bold;">This item has been removed from the active needs list.</p>'}
          <p>- NeighborSOS</p>
        </div>
      `
    })
  });
  
  const fulfilledMsg = isFullyFulfilled 
  ? `This need is now fully fulfilled!` 
  : `${newQuantity} more still needed.`;

alert(`Thank you ${donorName}!\n\nYou've committed to donating:\n${donorQuantity} ${selectedNeed.item}\n\n${fulfilledMsg}\n\nCheck your email (${donorEmail}) for delivery instructions from ${charity?.name}.\n\n⚠️ If you don't see the email, please check your SPAM or Promotions folder.`);
  
  // Refresh the needs list
  const { data: needs } = await supabase
    .from('urgent_needs')
    .select(`*, charities (name, zip_code)`)
    .eq('status', 'available')
    .order('urgency_hours', { ascending: true });
  
  if (needs) {
    const formattedNeeds = needs.map((need: any) => ({
      id: need.id,
      charity: need.charities.name,
      charityId: need.charity_id,
      charityZipCode: need.charities.zip_code,
      item: need.item_name,
      quantity: need.quantity,
      category: need.category,
      urgency: `${need.urgency_hours} hours`,
      distance: '-- miles',
      notes: need.notes
    }));
    setCurrentNeeds(formattedNeeds);
  }
  
  // Close modal and reset
  setSelectedNeed(null);
  setDonorEmail('');
  setDonorName('');
  setDonorQuantity(1);
  setIsSubmitting(false);
}

  const getAccentColor = (accent: string) => {
    switch(accent) {
      case 'mint': return 'from-[#ADEBB3] to-[#8dd99a]';
      case 'navy': return 'from-[#000080] to-[#000066]';
      case 'coral': return 'from-[#FF8559] to-[#ff6b3d]';
      default: return 'from-[#8B8589] to-[#75727a]';
    }
  };

async function handleSortByDistance() {
  if (!userZipCode || userZipCode.length !== 5) {
    alert('Please enter a valid 5-digit zip code');
    return;
  }

  setIsScrolling(false);

  const needsWithDistance = await Promise.all(
    currentNeeds.map(async (need: any) => {
      // Use stored charityZipCode if available, otherwise fetch from database
      let charityZip = need.charityZipCode;
      
      if (!charityZip) {
        const { data: charity } = await supabase
          .from('charities')
          .select('zip_code')
          .eq('name', need.charity)
          .single();
        
        charityZip = charity?.zip_code;
      }
      
      if (!charityZip) {
        return { ...need, calculatedDistance: 999, distance: '-- miles' };
      }

      const distance = await calculateDistance(userZipCode, charityZip);
      return { 
        ...need, 
        calculatedDistance: distance,
        distance: `${distance} miles`
      };
    })
  );

  const sorted = needsWithDistance.sort((a, b) => a.calculatedDistance - b.calculatedDistance);
  setCurrentNeeds(sorted);
}

async function handleSortByUrgency() {
  setIsScrolling(false);
  
  // Re-fetch needs sorted by urgency
  const { data: needs } = await supabase
    .from('urgent_needs')
    .select(`
      *,
      charities (name, zip_code)
    `)
    .eq('status', 'available')
    .order('urgency_hours', { ascending: true });

  if (needs) {
    const formattedNeeds = needs.map((need: any) => ({
      id: need.id,
      charity: need.charities.name,
      charityZipCode: need.charities.zip_code, // Store for later distance calc
      item: need.item_name,
      quantity: need.quantity,
      category: need.category,
      urgency: `${need.urgency_hours} hours`,
      distance: '-- miles', // Default placeholder
      notes: need.notes
    }));
    setCurrentNeeds(formattedNeeds);
  }

}

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 md:px-8 py-6 md:py-12">
        
        {/* Header with Navy accent */}
        <div className="mb-6 md:mb-12 border-l-4 border-[#000080] pl-3 md:pl-6">
  <h1 className="text-2xl md:text-4xl font-serif text-[#3a3a3a] mb-2 md:mb-3">
    Real people. Real needs. Right now.
  </h1>
  <p className="text-base md:text-lg" style={{color: '#8B8589'}}>
    Connect with verified charities serving people and animals in crisis
  </p>
</div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* LEFT: Narrow Image Tiles with Hover Popups (2/3 width) */}
          <div className="md:col-span-2 col-span-1">
            <h2 className="text-2xl font-serif text-[#3a3a3a] mb-6">Impact Stories</h2>
            
            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto pb-6">
              <div className="flex gap-4 items-end" style={{width: 'max-content'}}>
                {successStories.map((story) => (
                  <div 
                    key={story.id} 
                    className={`relative group cursor-pointer transition-all duration-300 hover:z-50 ${hoveredStory !== null && hoveredStory !== story.id ? 'opacity-30' : 'opacity-100'} ${hoveredStory === story.id ? 'w-80 md:w-96' : 'w-24 md:w-20'} ${story.height}`}
                    onMouseEnter={() => setHoveredStory(story.id)}
                    onMouseLeave={() => setHoveredStory(null)}
                  >
                    {/* Tile Container */}
                    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden group-hover:shadow-2xl transition-all border border-gray-100">
                      {/* Colored accent bar at top */}
                      <div className={`h-1 bg-gradient-to-r ${getAccentColor(story.accent)}`}></div>
                      
                      {/* Image */}
                      <div className="w-full h-[calc(100%-4px)] relative overflow-hidden">
                        <Image 
                          src={`/images/${story.image}.jpg`}
                          alt={story.name}
                          fill
                          className={`transition-all duration-300 ${hoveredStory === story.id ? 'object-contain' : 'object-cover'}`}
                          sizes="(max-width: 768px) 100vw, 24rem"
                        />
                      </div>
                    </div>

                    {/* Hover Popup - Shows at top with story */}
                    {hoveredStory === story.id && (
                      <div 
                        className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-t-lg shadow-xl p-4 z-20 border-t-2" 
                        style={{borderColor: story.accent === 'mint' ? '#ADEBB3' : story.accent === 'navy' ? '#000080' : '#FF8559'}}
                      >
                        <h3 className="font-serif text-base text-[#3a3a3a] mb-2 font-semibold">{story.name}</h3>
                        <p className="text-[#6a6a6a] text-xs leading-relaxed mb-2">{story.story}</p>
                        <div className="text-xs" style={{color: '#8B8589'}}>
                          Click to read more →
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll hint */}
            <p className="text-sm text-[#8B8589] mt-2 text-center">← Hover over images to see stories →</p>
          </div>

          {/* RIGHT: Urgent Needs List (1/3 width) */}
          <div className="md:col-span-1 col-span-1">
            
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border-t-4 border-[#000080]">
              
              {/* Header */}
              <div className="mb-6 border-b pb-4" style={{borderColor: '#e5e4e2'}}>
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-lg md:text-xl font-serif text-[#3a3a3a]">Urgent Needs</h2>
    <button 
      onClick={() => setIsScrolling(!isScrolling)}
      className="hidden md:block text-xs hover:text-[#000080] transition-colors uppercase tracking-wide"
      style={{color: '#8B8589'}}
    >
      {isScrolling ? 'Pause' : 'Resume'}
    </button>
  </div>
  
  <div className="space-y-2">
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={userZipCode}
        onChange={(e) => setUserZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
        placeholder="Your zip code"
        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        maxLength={5}
      />
      <button
        onClick={handleSortByDistance}
        className="px-3 py-1.5 text-xs bg-[#000080] text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Sort by Distance
      </button>
    </div>
    
    <button
      onClick={handleSortByUrgency}
      className="w-full px-3 py-1.5 text-xs bg-[#FF8559] text-white rounded-lg hover:opacity-90 transition-opacity"
    >
      Sort by Urgency
    </button>
  </div>
  
  <p className="text-xs md:hidden text-gray-500 mt-2">↓ Scroll to see more items</p>
</div>

              {/* Scrollable Needs List */}
              <div 
  ref={scrollRef}
  className="h-[400px] md:h-[500px] overflow-y-auto space-y-4 md:pr-2 -mx-4 px-4 md:mx-0 md:px-0"
  style={{ 
    scrollBehavior: 'smooth',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    touchAction: 'pan-y'
  }}
>
                {currentNeeds.map((need) => (
                  <div 
                    key={need.id} 
                    className="border-b pb-4 last:border-0 hover:bg-[#f9f9f8] transition-colors p-3 -mx-3 rounded"
                    style={{borderColor: '#e5e4e2'}}
                  >
                    <div className="mb-2">
                      <h3 className="font-medium text-[#3a3a3a] text-sm mb-1">{need.item}</h3>
                      <p className="text-xs" style={{color: '#8B8589'}}>{need.charity}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div style={{color: '#8B8589'}}>
                        <span>{need.distance}</span>
                        <span className="mx-2">·</span>
                        <span className="font-medium" style={{color: '#000080'}}>{need.urgency} left</span>
                      </div>
                      <button 
                        onClick={() => {
  setSelectedNeed(need);
  setDonorQuantity(1);
  setIsScrolling(false);
}}
                        className="font-medium transition-colors text-xs px-3 py-1 rounded hover:opacity-90"
                        style={{backgroundColor: '#FF8559', color: 'white'}}
                      >
                        Help →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Claim Item Modal */}
      {selectedNeed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl md:text-2xl font-serif text-[#3a3a3a] mb-4">Claim This Item</h2>
            
            <div className="mb-4 p-4 bg-blue-50 rounded">
  <div className="flex items-center gap-2 mb-2">
    <h3 className="font-semibold text-[#000080]">{selectedNeed.item}</h3>
    {selectedNeed.category && (
      <span className="text-xs bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full capitalize">
        {selectedNeed.category}
      </span>
    )}
  </div>
  <p className="text-sm text-gray-600 mb-2">{selectedNeed.charity}</p>
  <div className="text-sm text-gray-700 space-y-1">
    <p><span className="font-medium">Quantity still needed:</span> {selectedNeed.quantity || 1}</p>
    <p><span className="font-medium">Urgency:</span> {selectedNeed.urgency} left</p>
    <p><span className="font-medium">Distance:</span> {selectedNeed.distance} away</p>
  </div>
  {selectedNeed.notes && (
    <div className="mt-3 pt-3 border-t border-blue-200">
      <p className="text-xs font-medium text-gray-700 mb-1">Additional Details:</p>
      <p className="text-sm text-gray-600 italic">"{selectedNeed.notes}"</p>
    </div>
  )}
</div>

{/* Quantity Selection */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <p className="text-xs text-gray-500">
                By claiming this item, you commit to purchasing and delivering it to the charity within 48 hours. The charity will contact you with delivery details.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedNeed(null);
                  setDonorEmail('');
                  setDonorName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClaimItem}
                disabled={!donorEmail || !donorName || isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: '#FF8559', color: 'white'}}
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