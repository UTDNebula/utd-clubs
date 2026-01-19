import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
require('./src/env.mjs');

const config: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/download/storage/v1/b/utdnebula_jupiter/**',
        port: '',
      },
    ],
  },
};

export default withSentryConfig(config, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'utdnebula',
  project: 'clubs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  sourcemaps: {
    disable: process.env.VERCEL_ENV !== 'production',
  },
  release: {
    create: process.env.VERCEL_ENV === 'production',
  },
});
