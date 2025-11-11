'use client';

import localFont from "next/font/local";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b" style={{borderColor: '#e5e4e2'}}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-4xl font-serif">
                  <span style={{color: '#000080'}}>Neighbor</span>
                  <span style={{color: '#c97357'}}>SOS</span>
                </span>
              </div>
              
              <nav>
  {/* Desktop Navigation - Hidden on Mobile */}
  <div className="hidden md:flex items-center gap-8">
    <a href="/" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>Home</a>
    <a href="/needs" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>Browse Needs</a>
    <a href="/charities" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>For Charities</a>
    <a href="/about" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>About</a>
    <a href="/login" className="bg-[#000080] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
      Sign In
    </a>
  </div>

  {/* Mobile Navigation - Shown on Mobile Only */}
  <div className="md:hidden flex items-center gap-4">
    <a href="/login" className="bg-[#000080] text-white px-4 py-1.5 rounded-lg text-sm hover:opacity-90 transition-opacity">
      Sign In
    </a>
    <button 
      onClick={() => {
        const menu = document.getElementById('mobile-menu');
        menu?.classList.toggle('hidden');
      }}
      className="text-gray-600 hover:text-[#000080] transition-colors"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</nav>

{/* Mobile Menu Dropdown */}
<div id="mobile-menu" className="hidden md:hidden absolute top-16 right-0 bg-white shadow-lg rounded-lg p-4 m-4 z-50 min-w-[200px]">
  <div className="flex flex-col gap-3">
    <a href="/" className="font-medium py-2 px-3 rounded hover:bg-gray-100 transition-colors" style={{color: '#8B8589'}}>Home</a>
    <a href="/needs" className="font-medium py-2 px-3 rounded hover:bg-gray-100 transition-colors" style={{color: '#8B8589'}}>Browse Needs</a>
    <a href="/charities" className="font-medium py-2 px-3 rounded hover:bg-gray-100 transition-colors" style={{color: '#8B8589'}}>For Charities</a>
    <a href="/about" className="font-medium py-2 px-3 rounded hover:bg-gray-100 transition-colors" style={{color: '#8B8589'}}>About</a>
  </div>
</div>
              
              {/* Sign In Button - Navy with subtle styling */}
              <div>
                <button className="px-5 py-2 rounded-lg font-medium transition-all hover:opacity-90" style={{backgroundColor: '#000080', color: 'white'}}>
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        {children}

        {/* Footer */}
        <footer className="bg-[#2a2a2a] text-white mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-serif mb-4">
                  <span style={{color: '#8B8589'}}>Neighbor</span>
                  <span style={{color: '#c97357'}}>SOS</span>
                </h3>
                <p style={{color: '#8B8589'}}>Connecting urgent charity needs with local donors in real-time.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2" style={{color: '#8B8589'}}>
                  <li><a href="/needs" className="hover:text-white transition-colors">Browse Needs</a></li>
                  <li><a href="/charities" className="hover:text-white transition-colors">For Charities</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p style={{color: '#8B8589'}}>support@neighborsos.org</p>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center" style={{borderColor: '#4a4a4a', color: '#8B8589'}}>
              <p>&copy; 2025 NeighborSOS. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}