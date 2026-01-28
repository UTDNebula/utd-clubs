import '@src/styles/globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleAnalytics } from '@next/third-parties/google';
import { type Metadata } from 'next';
import { Bai_Jamjuree, Inter } from 'next/font/google';
import { RegisterModalProvider } from '@src/components/global/RegisterModalProvider';
import { SnackbarProvider } from '@src/components/global/Snackbar';
import { TRPCReactProvider } from '@src/trpc/react';
import ClientLocalizationProvider from '@src/utils/localization';
import theme from '@src/utils/theme';

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
  metadataBase: new URL('https://clubs.utdnebula.com'),
  title: {
    template: '%s - UTD CLUBS',
    default: 'UTD CLUBS',
  },
  description:
    'A student organization portal to connect interested students at UTD with organizations on campus.',
  keywords: ['UT Dallas', 'clubs', 'organizations', 'events'],
  openGraph: {
    title: 'UTD Clubs',
    description:
      'A student organization portal to connect interested students at UTD with organizations on campus.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
  other: {
    'geo.region': 'US-TX',
    'geo.placename': 'Richardson',
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
      <body
        className={`bg-light dark:bg-dark ${inter.variable} font-main ${baiJamjuree.variable} text-haiti dark:text-white`}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <TRPCReactProvider>
            <ThemeProvider theme={theme}>
              <ClientLocalizationProvider>
                <RegisterModalProvider>
                  <SnackbarProvider>{children}</SnackbarProvider>
                </RegisterModalProvider>
              </ClientLocalizationProvider>
            </ThemeProvider>
          </TRPCReactProvider>
          {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
            <GoogleAnalytics gaId="G-FYTBHVKNG6" />
          )}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
