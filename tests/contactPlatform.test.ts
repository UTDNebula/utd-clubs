import { describe, expect, test } from '@jest/globals';
import type { ContactSchema } from '@/lib/utils/commonSchemas';
import {
  convertOtherContactPlatforms,
  detectContactPlatform,
} from '@/systems/manage/forms/Contacts/contactPlatform';

describe('detectContactPlatform', () => {
  test.each([
    ['https://discord.gg/utd', 'discord'],
    ['https://canary.discord.com/channels/1/2', 'discord'],
    ['https://www.instagram.com/utdnebula/', 'instagram'],
    ['https://x.com/utdnebula', 'twitter'],
    ['https://mobile.twitter.com/utdnebula', 'twitter'],
    ['https://www.facebook.com/utdnebula', 'facebook'],
    ['https://youtu.be/example', 'youtube'],
    ['https://music.youtube.com/channel/example', 'youtube'],
    ['https://www.twitch.tv/utdnebula', 'twitch'],
    ['https://www.linkedin.com/company/utdnebula', 'linkedIn'],
  ])('detects %s as %s', (url, platform) => {
    expect(detectContactPlatform(url)).toBe(platform);
  });

  test('does not treat a lookalike domain as a branded platform', () => {
    expect(detectContactPlatform('https://notinstagram.com/utdnebula')).toBe(
      'website',
    );
  });

  test('does not detect an invalid URL', () => {
    expect(detectContactPlatform('not a URL')).toBeNull();
  });

  test('uses Website as the fallback for a generic web URL', () => {
    expect(
      detectContactPlatform(
        'https://example.com/?next=https://twitter.com/utdnebula',
      ),
    ).toBe('website');
  });
});

describe('convertOtherContactPlatforms', () => {
  test('converts an Other URL when its detected platform is unfilled', () => {
    const contacts: ContactSchema[] = [
      {
        clubId: 'club-1',
        platform: 'other',
        url: 'https://instagram.com/utdnebula',
      },
    ];

    expect(convertOtherContactPlatforms(contacts)).toEqual([
      {
        clubId: 'club-1',
        platform: 'instagram',
        url: 'https://instagram.com/utdnebula',
      },
    ]);
    expect(contacts[0]?.platform).toBe('other');
  });

  test('keeps Other when the detected platform is already filled', () => {
    const contacts: ContactSchema[] = [
      {
        platform: 'instagram',
        url: 'https://instagram.com/existing',
      },
      {
        platform: 'other',
        url: 'https://instagram.com/utdnebula',
      },
    ];

    expect(convertOtherContactPlatforms(contacts)).toEqual(contacts);
  });

  test('uses Website for a generic URL when Website is unfilled', () => {
    const contacts: ContactSchema[] = [
      { platform: 'other', url: 'https://example.com' },
    ];

    expect(convertOtherContactPlatforms(contacts)).toEqual([
      { platform: 'website', url: 'https://example.com' },
    ]);
  });

  test('keeps a generic URL as Other when Website is already filled', () => {
    const contacts: ContactSchema[] = [
      { platform: 'website', url: 'https://utdnebula.com' },
      { platform: 'other', url: 'https://example.com' },
    ];

    expect(convertOtherContactPlatforms(contacts)).toEqual(contacts);
  });

  test('does not infer Email from a mailto URL', () => {
    const contacts: ContactSchema[] = [
      { platform: 'other', url: 'mailto:hello@example.com' },
    ];

    expect(convertOtherContactPlatforms(contacts)).toEqual(contacts);
  });
});
