export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2d3436] mb-6 text-center">
          About NeighborSOS
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          <section className="mb-10">
            <h2 className="text-3xl font-serif text-[#2d3436] mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              NeighborSOS connects urgent charity needs with local donors in real-time, ensuring that help arrives when it's needed most.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe that neighbors helping neighbors creates stronger, more compassionate communities. Our platform makes it easy for you to see exactly what local charities need right now—whether it's winter coats for children, food for families, or household essentials—and take immediate action.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-serif text-[#2d3436] mb-4">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <div className="w-12 h-12 bg-[#8B8589] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-[#2d3436] mb-2">Browse Needs</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  See real-time urgent needs from verified local charities
                </p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <div className="w-12 h-12 bg-[#c97357] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-[#2d3436] mb-2">Choose to Help</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Claim items you can donate and coordinate delivery
                </p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <div className="w-12 h-12 bg-[#000080] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-[#2d3436] mb-2">Make Impact</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your donation reaches families within hours, not weeks
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-serif text-[#2d3436] mb-4">Our Programs</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-[#c97357] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#2d3436] mb-2">Urgent Needs</h3>
                <p className="text-gray-700 leading-relaxed">
                  Local charities post time-sensitive needs for specific items. You browse what's urgently needed, claim what you can donate, and deliver directly. Every need is verified and every donation makes an immediate impact.
                </p>
              </div>
              
              <div className="border-l-4 border-[#8B8589] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#2d3436] mb-2">Sponsor a Family</h3>
                <p className="text-gray-700 leading-relaxed">
                  During the holiday season, sponsor local families in need. You can sponsor a family fully or split costs with friends and family. Every family is verified by partnering charities, and you receive clear instructions for gift delivery.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-serif text-[#2d3436] mb-4">Our Commitment</h2>
            
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#000080] flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-[#2d3436] mb-1">Verified Charities</h4>
                  <p className="text-gray-600 text-sm">All charities on our platform are verified 501(c)(3) organizations</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#000080] flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-[#2d3436] mb-1">Real Needs</h4>
                  <p className="text-gray-600 text-sm">Every posted need is legitimate, urgent, and vetted by our team</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#000080] flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-[#2d3436] mb-1">Transparent Process</h4>
                  <p className="text-gray-600 text-sm">You know exactly where your donation is going and when it's needed</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#000080] flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-[#2d3436] mb-1">Immediate Impact</h4>
                  <p className="text-gray-600 text-sm">Your donations reach families within hours or days, not weeks or months</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-serif text-[#2d3436] mb-4">Why NeighborSOS?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Traditional charity donation models can feel impersonal and disconnected. You donate money or items, but you rarely see the direct impact or know if your contribution truly made a difference.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              NeighborSOS changes that. We connect you directly with urgent, specific needs in your local community. You see exactly what's needed, who needs it, and when. You coordinate directly with charities. And you know—without a doubt—that your donation arrived exactly when and where it was needed most.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We're not just facilitating donations. We're building a community of neighbors who care for one another.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-serif text-[#2d3436] mb-4">Based in Saint Paul</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              NeighborSOS is proudly based in Saint Paul, Minnesota, serving local communities throughout the Twin Cities and beyond. We started with a simple belief: that technology can make charity more personal, more immediate, and more impactful.
            </p>
            <p className="text-gray-700 leading-relaxed">
              As we grow, we remain committed to our core values of transparency, community, and compassion.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-serif text-[#2d3436] mb-4">For Charities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Are you a 501(c)(3) charitable organization looking to connect with local donors? NeighborSOS makes it easy to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Post urgent needs and get immediate responses</li>
              <li>Coordinate directly with donors</li>
              <li>List families for holiday sponsorship</li>
              <li>Receive help exactly when you need it most</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              <a href="/signup" className="text-[#000080] hover:underline font-semibold">Register your charity</a> and start connecting with donors today.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-serif text-[#2d3436] mb-4">Get Involved</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ready to make a difference in your community?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/needs" 
                className="flex-1 bg-[#c97357] text-white px-6 py-3 rounded-lg text-center font-semibold hover:opacity-90 transition-opacity"
              >
                Browse Urgent Needs
              </a>
              <a 
                href="/adopt-a-family" 
                className="flex-1 bg-[#8B8589] text-white px-6 py-3 rounded-lg text-center font-semibold hover:opacity-90 transition-opacity"
              >
                Sponsor a Family
              </a>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-3xl font-serif text-[#2d3436] mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Have questions? Want to learn more? We'd love to hear from you.
            </p>
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>NeighborSOS</strong></p>
              <p className="text-gray-700 mb-2">Saint Paul, Minnesota</p>
              <p className="text-gray-700 mb-2">
                Email: <a href="mailto:info@neighborsos.org" className="text-[#000080] hover:underline">info@neighborsos.org</a>
              </p>
              <p className="text-gray-700">
                Website: <a href="https://neighborsos.org" className="text-[#000080] hover:underline">neighborsos.org</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}