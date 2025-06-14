import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { RestaurantProvider } from '@/context/RestaurantContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Savoria - Fine Dining Experience',
  description: 'Experience exceptional cuisine with our carefully crafted menu, featuring the finest ingredients and innovative culinary techniques. Reserve your table today.',
  keywords: ['restaurant', 'fine dining', 'cuisine', 'reservations', 'food', 'gourmet', 'michelin star'],
  authors: [{ name: 'Savoria Restaurant' }],
  creator: 'Savoria Restaurant',
  publisher: 'Savoria Restaurant',
  metadataBase: new URL('https://savoria.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://savoria.com',
    title: 'Savoria - Fine Dining Experience',
    description: 'Experience exceptional cuisine with our carefully crafted menu, featuring the finest ingredients and innovative culinary techniques.',
    siteName: 'Savoria Restaurant',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Savoria Restaurant - Fine Dining Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Savoria - Fine Dining Experience',
    description: 'Experience exceptional cuisine with our carefully crafted menu.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d97706" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <RestaurantProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </RestaurantProvider>
        </AuthProvider>
      </body>
    </html>
  );
}