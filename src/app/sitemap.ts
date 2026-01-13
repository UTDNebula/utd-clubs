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
      priority: 0.7,
    },
    {
      url: 'https://clubs.utdnebula.com/club-match',
      priority: 1,
    },
    ...allClubs.map((club) => ({
      url: 'https://clubs.utdnebula.com/directory/' + club.slug,
      lastModified: club.updatedAt ?? new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    {
      url: 'https://clubs.utdnebula.com/directory/create',
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    ...events.map((event) => ({
      url: 'https://clubs.utdnebula.com/events/' + event.id,
      lastModified: event.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    {
      url: 'https://clubs.utdnebula.com/events',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
