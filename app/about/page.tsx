'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
        
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3a3a3a] mb-4">
            About NeighborSOS
          </h1>
          <p className="text-xl text-[#8B8589]">
            Connecting communities in times of need
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 space-y-8">
          
          {/* Our Mission */}
          <section>
            <div className="border-l-4 border-[#000080] pl-6 mb-6">
              <h2 className="text-2xl md:text-3xl font-serif text-[#3a3a3a] mb-3">
                Our Mission
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              We created NeighborSOS to make local giving simple and immediate:
            </p>
            <ul className="space-y-3 text-lg text-gray-700 ml-6">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>In challenging economic times, many organizations face unexpected needs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Generous donors want to help but don't know where to start</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Instead of scattered searches, NeighborSOS brings everyone together in one place</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Charities can quickly post urgent needs, and donors can instantly see how to help their community—right now</span>
              </li>
            </ul>
          </section>

          {/* How It Works */}
          <section>
            <div className="border-l-4 border-[#FF8559] pl-6 mb-6">
              <h2 className="text-2xl md:text-3xl font-serif text-[#3a3a3a] mb-3">
                How It Works
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* For Donors */}
              <div className="bg-blue-50 rounded-lg p-6 border-t-4 border-[#000080]">
                <h3 className="text-xl font-semibold text-[#000080] mb-4">For Donors</h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold text-[#000080] mr-3">1.</span>
                    <span>Browse urgent needs from verified local charities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-[#000080] mr-3">2.</span>
                    <span>Click "Help" on any item that speaks to you</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-[#000080] mr-3">3.</span>
                    <span>Commit to purchasing and delivering the item</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-[#000080] mr-3">4.</span>
                    <span>The charity contacts you with delivery details</span>
                  </li>
                </ol>
              </div>

              {/* For Charities */}
              <div className="bg-green-50 rounded-lg p-6 border-t-4 border-[#ADEBB3]">
                <h3 className="text-xl font-semibold text-[#3a3a3a] mb-4">For Charities</h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold text-[#3a3a3a] mr-3">1.</span>
                    <span>Register your organization (verification within 48 hours)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-[#3a3a3a] mr-3">2.</span>
                    <span>Post urgent needs with specific details and timelines</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-[#3a3a3a] mr-3">3.</span>
                    <span>Receive notifications when donors commit to help</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-[#3a3a3a] mr-3">4.</span>
                    <span>Coordinate delivery and make an immediate impact</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Founder Story */}
          <section>
            <div className="border-l-4 border-[#ADEBB3] pl-6 mb-6">
              <h2 className="text-2xl md:text-3xl font-serif text-[#3a3a3a] mb-3">
                Our Story
              </h2>
            </div>
            
            <div className="text-gray-700 space-y-4">
              <p className="text-lg leading-relaxed">
                NeighborSOS was founded by <span className="font-semibold">Donna Clark</span>, a St. Paul, Minnesota 
                resident who experienced firsthand the frustration of trying to help local charities. After countless 
                unreturned calls and missed connections, she watched as organizations struggled to find donors—and 
                donors struggled to find where they were needed most.
              </p>
              
              <p className="text-lg leading-relaxed">
                The turning point came when a friend made a simple plea on social media to help a neighbor in need. 
                The response was overwhelming: <span className="font-semibold">yet she ended up with an overabundance of boxes of mac and cheese</span> and 
                <span className="font-semibold"> and boxes of cereal</span> from people who had been shopping 
                the sales and wanted to share. That moment revealed the truth: people want to help, they just need to 
                know what, where and when.
              </p>
              
              <p className="text-lg leading-relaxed">
                Donna, who lives with her 16-year-old daughter, spends her free time hiking and walking the beautiful 
                Mississippi River Parkway—especially in fall when the leaves paint the riverbanks in brilliant colors. 
                Those walks along the river, through neighborhoods filled with generous people, inspired her to build 
                a platform where community connections could happen instantly.
              </p>
              
              <p className="text-lg leading-relaxed font-medium text-[#000080]">
                NeighborSOS was born from one simple belief: when we make it easy for neighbors to help neighbors, 
                amazing things happen.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-[#2a4a7c] rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg mb-6 opacity-90">
              Whether you're looking to give or in need of support, we're here to connect you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/" 
                className="bg-white text-[#000080] px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Browse Urgent Needs
              </a>
              <a 
                href="/signup" 
                className="bg-[#FF8559] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Register Your Charity
              </a>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              Questions? Reach us at{' '}
              <a href="mailto:info@neighborsos.org" className="text-[#000080] hover:underline font-medium">
                info@neighborsos.org
              </a>
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}