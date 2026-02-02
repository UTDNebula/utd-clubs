import type { MetadataRoute } from 'next';
import type { SelectClub as Club } from '@src/server/db/models';
import { api } from '@src/trpc/server';

// types of sitemaps
export async function generateSitemaps() {
  return [{ id: 'clubs' }, { id: 'events' }, { id: 'static' }];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  // generate each type of sitemap separately
  switch (id) {
    case 'clubs': {
      //Fetch all clubs
      let cursor = 0;
      const limit = 50;
      let allClubs: Club[] = [];
      while (true) {
        const { clubs, cursor: newCursor } = await api.club.all({
          limit,
          cursor,
        });
        allClubs = allClubs.concat(clubs);
        if (clubs.length < limit) break;
        cursor = newCursor;
      }

      return [
        ...allClubs.map((club) => ({
          url: 'https://clubs.utdnebula.com/directory/' + club.slug,
          lastModified: club.updatedAt ?? new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.9,
        })),
      ];
    }
    case 'events': {
      //Fetch all events
      const events = await api.event.byDateRange({
        startTime: new Date(new Date().setMonth(new Date().getMonth() - 2)), // 2 months ago
        endTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year later
      });

      const midnightToday = new Date();
      midnightToday.setHours(0, 0, 0, 0);

      return [
        ...events.map((event) => ({
          url: 'https://clubs.utdnebula.com/events/' + event.id,
          lastModified: event.updatedAt,
          changeFrequency: 'monthly' as const,
          priority: 0.9,
        })),
        {
          url: 'https://clubs.utdnebula.com/events',
          lastModified: midnightToday,
          changeFrequency: 'daily',
          priority: 1,
        },
      ];
    }
    case 'static':
    default: {
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
        {
          url: 'https://clubs.utdnebula.com/directory/create',
          lastModified: new Date(),
          changeFrequency: 'yearly' as const,
          priority: 0.6,
        },
      ];
    }
  }
}
