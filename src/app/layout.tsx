import '@src/styles/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import { TRPCReactProvider } from '@src/trpc/react';
import { type Metadata } from 'next';
import { Bai_Jamjuree, Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-main',
});

const baiJamjuree = Bai_Jamjuree({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
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
  //copied from globals.css
  themeColor: '#573DFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-main ${baiJamjuree.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
          <GoogleAnalytics gaId="G-FYTBHVKNG6" />
        )}
      </body>
    </html>
  );
}
