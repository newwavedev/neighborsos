import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from 'next/link';
import Script from 'next/script';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NeighborSOS - Connect Local Charities with Donors",
  description: "Help local charities get urgent needs fulfilled by connecting with donors in your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navigation */}
        <nav className="bg-white shadow-md border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-3xl font-serif">
                  <span style={{color: '#000080'}}>Neighbor</span>
                  <span style={{color: '#FF8559'}}>SOS</span>
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-gray-700 hover:text-[#000080] transition-colors font-medium">
                  Home
                </Link>
                <Link href="/needs" className="text-gray-700 hover:text-[#000080] transition-colors font-medium">
                  Browse Needs
                </Link>
                <Link href="/adopt-a-family" className="text-gray-700 hover:text-[#FF8559] transition-colors font-medium flex items-center gap-1">
                  <span>✨</span>
                  <span>Sponsor a Family</span>
                </Link>
                <Link href="/charities" className="text-gray-700 hover:text-[#000080] transition-colors font-medium">
                  For Charities
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-[#000080] transition-colors font-medium">
                  About
                </Link>
                <Link 
                  href="/login" 
                  className="px-6 py-2 rounded-lg font-medium text-white transition-colors"
                  style={{backgroundColor: '#000080'}}
                >
                  Sign In
                </Link>
              </div>

              <button className="md:hidden text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#2d3436] text-white py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-serif mb-4">
                  <span style={{color: '#ffffff'}}>Neighbor</span>
                  <span style={{color: '#FF8559'}}>SOS</span>
                </h3>
                <p className="text-gray-300 text-sm">
                  Connecting local charities with donors to fulfill urgent community needs.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/needs" className="text-gray-300 hover:text-white transition-colors">Browse Needs</Link></li>
                  <li><Link href="/adopt-a-family" className="text-gray-300 hover:text-white transition-colors">Sponsor a Family</Link></li>
                  <li><Link href="/charities" className="text-gray-300 hover:text-white transition-colors">For Charities</Link></li>
                  <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <div className="flex gap-4">
                  <a href="https://facebook.com/YOUR_PAGE" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com/YOUR_HANDLE" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} NeighborSOS. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}