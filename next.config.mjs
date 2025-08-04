/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.mjs');

/** @type {import("next").NextConfig} */
const config = {
  images: {
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
        hostname: 'jupiter.nlmc.workers.dev',
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

export default config;
