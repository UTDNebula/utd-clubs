import { eq } from 'drizzle-orm';
import { ImageResponse } from 'next/og';
import { db } from '@src/server/db';

// Import your schema tables if needed, e.g.: import { clubs } from '@src/server/db/schema';

export const runtime = 'edge'; // Faster generation

export const alt = 'Club Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  // 1. Get the slug
  const slug = params.slug;

  // 2. Fetch data (Reusing your DB logic)
  const found = await db.query.club.findFirst({
    where: (club) => eq(club.slug, slug),
  });

  // 3. Handle missing data
  if (!found) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Club Not Found
        </div>
      ),
      { ...size },
    );
  }

  // 4. Return the generated image
  const clubImage = found.profileImage;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a', // Dark background
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {/* Render the Club Image if it exists */}
        {clubImage && (
          <img
            src={clubImage}
            alt={found.name}
            style={{
              width: 150,
              height: 150,
              borderRadius: 75, // Circular image
              objectFit: 'cover',
              marginBottom: 20,
              border: '4px solid white',
            }}
          />
        )}

        {/* Club Name */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '0 40px',
            lineHeight: 1.2,
          }}
        >
          {found.name}
        </div>

        {/* Branding Footer */}
        <div
          style={{
            fontSize: 24,
            marginTop: 20,
            opacity: 0.7,
          }}
        >
          UTD Clubs Directory
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
