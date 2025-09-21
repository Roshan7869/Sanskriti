import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { QueryProvider } from '@/lib/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' });

export const metadata: Metadata = {
  title: 'Tourista - Discover the World',
  description: 'Your ultimate guide to discovering tourist locations, festivals, and celebrations worldwide. Join our community and share your adventures.',
  keywords: 'travel, tourism, locations, festivals, events, world, discover, community',
  openGraph: {
    title: 'Tourista - Discover the World',
    description: 'Your ultimate guide to discovering tourist locations, festivals, and celebrations worldwide.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.variable} ${notoSerif.variable} font-sans`}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}