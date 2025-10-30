import type { MetadataRoute } from 'next';
import type { SelectClub as Club } from '@src/server/db/models';
import { api } from '@src/trpc/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //Fetch all clubs
  let cursor = 0;
  const limit = 50;
  let allClubs: Club[] = [];
  while (true) {
    const { clubs, cursor: newCursor } = await api.club.all({ limit, cursor });
    allClubs = allClubs.concat(clubs);
    if (clubs.length < limit) break;
    cursor = newCursor;
  }

  //Fetch all events
  const events = await api.event.byDateRange({
    startTime: new Date(),
    endTime: new Date('9999-12-31T23:59:59'),
  });

  return [
    {
      url: 'https://clubs.utdnebula.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clubs.utdnebula.com/community',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clubs.utdnebula.com/club-match',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...allClubs.map((club) => ({
      url: 'https://clubs.utdnebula.com/directory/' + club.slug,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...events.map((event) => ({
      url: 'https://clubs.utdnebula.com/event/' + event.id,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    {
      url: 'https://clubs.utdnebula.com/events',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clubs.utdnebula.com/feedback',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clubs.utdnebula.com/settings',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
