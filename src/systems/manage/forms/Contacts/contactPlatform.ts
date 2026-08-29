import type { ContactSchema, Platforms } from '@/lib/utils/commonSchemas';

const platformDomains = {
  discord: ['discord.com', 'discord.gg', 'discordapp.com'],
  instagram: ['instagram.com'],
  twitter: ['twitter.com', 'x.com'],
  facebook: ['facebook.com', 'fb.com', 'fb.me'],
  youtube: ['youtube.com', 'youtu.be'],
  twitch: ['twitch.tv'],
  linkedIn: ['linkedin.com'],
} as const satisfies Partial<Record<Platforms, readonly string[]>>;

type DetectablePlatform = keyof typeof platformDomains | 'website';

function matchesDomain(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

export function detectContactPlatform(url: string): DetectablePlatform | null {
  let protocol: string;
  let hostname: string;

  try {
    const parsedUrl = new URL(url);
    protocol = parsedUrl.protocol;
    hostname = parsedUrl.hostname.toLowerCase();
  } catch {
    return null;
  }

  for (const [platform, domains] of Object.entries(platformDomains) as [
    keyof typeof platformDomains,
    readonly string[],
  ][]) {
    if (domains.some((domain) => matchesDomain(hostname, domain))) {
      return platform;
    }
  }

  return protocol === 'http:' || protocol === 'https:' ? 'website' : null;
}

export function convertOtherContactPlatforms(
  contacts: ContactSchema[],
): ContactSchema[] {
  const occupiedPlatforms = new Set(
    contacts
      .filter(({ platform }) => platform !== 'other')
      .map(({ platform }) => platform),
  );

  return contacts.map((contact) => {
    if (contact.platform !== 'other') {
      return contact;
    }

    const detectedPlatform = detectContactPlatform(contact.url);
    if (!detectedPlatform || occupiedPlatforms.has(detectedPlatform)) {
      return contact;
    }

    occupiedPlatforms.add(detectedPlatform);
    return { ...contact, platform: detectedPlatform };
  });
}
