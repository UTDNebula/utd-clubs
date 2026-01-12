import { eq } from 'drizzle-orm';
import { ImageResponse } from 'next/og';
import { db } from '@src/server/db';

export const runtime = 'edge';
export const alt = 'Club Details';
export const size = { width: 630, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const clubData = await db.query.club.findFirst({
    where: (club) => eq(club.slug, slug),
  });
  const gradientBuffer = await fetch(
    new URL('../../opengraph-club-preview-bg.png', import.meta.url)
  ).then((res) => res.arrayBuffer());

  if (!clubData) {
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

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {/* 2. The Background Image Layer */}
        <img
        // @ts-ignore
          src={gradientBuffer} // Use the imported image source
          alt="background gradient"
          style={{
            position: 'absolute', // Take it out of normal flow
            top: 0,
            left: 0,
            width: '100%', // Stretch to fill container
            height: '100%',
            objectFit: 'cover', // Ensure it covers the area without stretching weirdly
            zIndex: -1, // Send it to the back
          }}
        />

        {/* 3. Your Content Layer (sits on top because zIndex default is 0) */}
        {clubData.profileImage && (
          <img
            src={clubData.profileImage}
            alt={clubData.name + ' logo'}
            style={{
              width: 400,
              height: 400,
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: 20,
              border: '6px solid white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          />
        )}
      </div>
    ),
    {
      ...size,
    },
  );
}
