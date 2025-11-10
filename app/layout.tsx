import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";



export const metadata: Metadata = {
  title: "NeighborSOS",
  description: "Connecting urgent charity needs with local donors in real-time",
};

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
              
              {/* Navigation Links */}
              <div className="hidden md:flex space-x-8">
                <a href="/" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>Home</a>
                <a href="/needs" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>Browse Needs</a>
                <a href="/charities" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>For Charities</a>
                <a href="/about" className="font-medium transition-colors hover:text-[#000080]" style={{color: '#8B8589'}}>About</a>
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