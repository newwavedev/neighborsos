import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NeighborSOS - Connecting Neighbors in Need',
  description: 'Real-time platform connecting local donors with verified charities. Browse urgent needs, sponsor families for the holidays, and make an immediate impact in your community.',
  openGraph: {
    title: 'NeighborSOS - Connecting Neighbors in Need',
    description: 'Real-time platform connecting local donors with verified charities. Browse urgent needs and sponsor families.',
    url: 'https://neighborsos.org',
    siteName: 'NeighborSOS',
    images: [
      {
        url: 'https://neighborsos.org/og-image.png',
        width: 1200,
        height: 650,
        alt: 'NeighborSOS - Connecting Neighbors in Need',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeighborSOS - Connecting Neighbors in Need',
    description: 'Real-time platform connecting local donors with verified charities.',
    images: ['https://neighborsos.org/og-image.png'],
  },
};