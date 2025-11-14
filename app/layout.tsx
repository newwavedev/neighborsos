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
              
              {/* Desktop Navigation - Hidden on Mobile */}
              <nav>
                <div className="hidden md:flex items-center gap-8">
                  <a href="/" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>Home</a>
                  <a href="/needs" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>Browse Needs</a>
                  <a href="/adopt-a-family" className="font-medium transition-colors hover:text-[#667eea]" style={{color: '#667eea'}}>✨ Sponsor a Family</a>
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
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </nav>

              {/* Mobile Menu Dropdown */}
              <div id="mobile-menu" className="hidden md:hidden absolute top-16 right-0 bg-white shadow-lg rounded-lg p-4 m-4 z-50 min-w-[200px]">
                <div className="flex flex-col gap-3">
                  <a href="/" className="font-medium py-2 px-3 rounded hover:bg-gray-100 transition-colors" style={{color: '#8B8589'}}>Home</a>
                  <a href="/adopt-a-family" className="font-medium py-2 px-3 rounded hover:bg-purple-50 transition-colors" style={{color: '#667eea'}}>✨ Sponsor a Family</a>
                  <a href="/needs" className="font-medium py-2 px-3 rounded hover:bg-gray-100 transition-colors" style={{color: '#8B8589'}}>Browse Needs</a>
                  <a href="/charities" className="font-medium py-2 px-3 rounded hover:bg-gray-100 transition-colors" style={{color: '#8B8589'}}>For Charities</a>
                  <a href="/about" className="font-medium py-2 px-3 rounded hover:bg-gray-100 transition-colors" style={{color: '#8B8589'}}>About</a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        {children}

        {/* Footer with Social Media Links */}
        <footer className="bg-[#2d3436] text-white mt-16">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              
              {/* About */}
              <div>
                <h3 className="text-lg font-serif mb-3">NeighborSOS</h3>
                <p className="text-sm text-gray-300">
                  Connecting neighbors in need with neighbors who care.
                </p>
              </div>

              {/* Quick Links */}
<div className="hidden md:flex items-center gap-8">
  <a href="/" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>Home</a>
  <a href="/needs" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>Browse Needs</a>
  <a href="/adopt-a-family" className="font-medium transition-colors hover:text-[#667eea]" style={{color: '#667eea'}}>✨ Sponsor a Family</a>
  <a href="/charities" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>For Charities</a>
  <a href="/faq" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>FAQ</a>
  <a href="/contact" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>Contact</a>
  <a href="/login" className="bg-[#000080] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
    Sign In
  </a>
</div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-serif mb-3">Contact</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <a href="mailto:info@neighborsos.org" className="hover:text-white transition-colors">
                      info@neighborsos.org
                    </a>
                  </li>
                  <li>Saint Paul, Minnesota</li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-serif mb-3">Follow Us</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://facebook.com/neighborsos" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="https://instagram.com/neighborsosmn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                  </a>

                  <a 
                    href="https://threads.net/@neighborsosmn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Threads"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142l-.126 1.974a11.881 11.881 0 0 0-2.582-.121c-1.99.097-3.003.674-3.234 1.839-.136.686.135 1.315.779 1.815.524.406 1.24.598 2.134.565 1.159-.043 2.023-.526 2.569-1.435.51-.85.793-2.003.793-3.425 0-2.516-.97-4.108-3.058-5.012-.673-.292-1.438-.477-2.274-.55a9.63 9.63 0 0 0-1.155-.058c-1.892.034-3.52.632-4.838 1.777-1.274 1.108-1.98 2.628-2.099 4.52v.021c.119 1.892.824 3.413 2.099 4.52 1.318 1.145 2.946 1.744 4.838 1.778.653.014 1.302-.027 1.932-.122l.126 1.974a13.51 13.51 0 0 1-2.226.137z"/>
                    </svg>
                  </a>

                  <a 
                    href="#" 
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center opacity-50 cursor-not-allowed"
                    aria-label="LinkedIn (Coming Soon)"
                    title="Coming Soon"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Share our mission with your community!
                </p>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} NeighborSOS. All rights reserved.</p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}