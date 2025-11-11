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
  const [donorName, setDonorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  
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
          charities (name)
        `)
        .eq('status', 'available')
        .order('urgency_hours', { ascending: true });
      
      if (needs) {
        const formattedNeeds = needs.map((need: any) => ({
          id: need.id,
          charity: need.charities.name,
          item: need.item_name,
          urgency: `${need.urgency_hours} hours`,
          distance: `${need.distance_miles} miles`
        }));
        setCurrentNeeds(formattedNeeds);
      }
    }

    fetchData();
  }, []);

  async function handleClaimItem() {
    if (!donorEmail || !donorName || !selectedNeed) return;
    setIsScrolling(false);  // ADD THIS LINE - stops scrolling when claiming

    setIsSubmitting(true);
    
    // Update the item status in database
    const { error } = await supabase
      .from('urgent_needs')
      .update({ 
        status: 'claimed',
        claimed_at: new Date().toISOString(),
        claimed_by_email: donorEmail
      })
      .eq('id', selectedNeed.id);
    
    if (error) {
      alert('Error claiming item. Please try again.');
    } else {
      alert(`Thank you ${donorName}! You've committed to helping with: ${selectedNeed.item}. The charity will contact you at ${donorEmail} within 24 hours.`);
      
      // Refresh the needs list
      const { data: needs } = await supabase
        .from('urgent_needs')
        .select(`*, charities (name)`)
        .eq('status', 'available')
        .order('urgency_hours', { ascending: true });
      
      if (needs) {
        const formattedNeeds = needs.map((need: any) => ({
          id: need.id,
          charity: need.charities.name,
          item: need.item_name,
          urgency: `${need.urgency_hours} hours`,
          distance: `${need.distance_miles} miles`
        }));
        setCurrentNeeds(formattedNeeds);
      }
      
      // Close modal
      setSelectedNeed(null);
      setDonorEmail('');
      setDonorName('');
    }
    
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
            
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-4 md:p-6 mx-4">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b pb-4" style={{borderColor: '#e5e4e2'}}>
  <div>
    <h2 className="text-lg md:text-xl font-serif text-[#3a3a3a]">Urgent Needs</h2>
    <p className="text-xs md:hidden text-gray-500 mt-1">↓ Scroll to see more items</p>
  </div>
  <button 
    onClick={() => setIsScrolling(!isScrolling)}
    className="hidden md:block text-xs hover:text-[#000080] transition-colors uppercase tracking-wide"
    style={{color: '#8B8589'}}
  >
    {isScrolling ? 'Pause' : 'Resume'}
  </button>
</div>

              {/* Scrollable Needs List */}
              <div 
  ref={scrollRef}
  className="h-[400px] md:h-[500px] overflow-y-scroll space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                style={{ 
                  scrollBehavior: 'smooth',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#8B8589 #e5e4e2'
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
              <h3 className="font-semibold text-[#000080] mb-1">{selectedNeed.item}</h3>
              <p className="text-sm text-gray-600">{selectedNeed.charity}</p>
              <p className="text-xs text-gray-500 mt-2">{selectedNeed.distance} away · {selectedNeed.urgency} left</p>
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