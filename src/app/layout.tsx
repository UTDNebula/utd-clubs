import '@src/styles/globals.css';

import { Inter } from 'next/font/google';
import { headers } from 'next/headers';

import { TRPCReactProvider } from '@src/trpc/react';
import { type Metadata } from 'next';

import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Jupiter',
  icons: ['favicon-32x32.png', 'favicon-16x16.png', 'logoIcon.svg'],
  manifest: 'site.webmanifest',
  description:
    'A student organization portal to connect organizations on campus with interested students at UTD.',
  openGraph: {
    title: 'Jupiter',
    description:
      'A student organization portal to connect organizations on campus with interested students at UTD.',
    images: ['https://jupiter.utdnebula.com/logoIcon.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    site: 'jupiter.utdnebula.com',
  },
};
export const viewport = {
  themeColor: '#573DFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <div className="flex flex-row">
            {/* <Sidebar /> */}
            <div className="max-h-screen w-full overflow-y-scroll">
              {children}
            </div>
          </div>
        </TRPCReactProvider>
        {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
          <GoogleAnalytics gaId="G-FYTBHVKNG6" />
        )}
      </body>
    </html>
  );
}
