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
          // 1. Set container to relative so the BG can be absolute inside it
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          // Ensure content centers properly on top of the BG
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          // REMOVED solid background: background: '#1a1a1a',
        }}
      >
        {/* 2. The Background Image Layer */}
        <img
          src={'/images/wideWave.jpg'} // Use the imported image source
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
        {/* Only render the logo circle if a profileImage exists */}
        {clubData.profileImage && (
          <img
            src={clubData.profileImage}
            alt={clubData.name + ' logo'}
            style={{
              width: 150,
              height: 150,
              borderRadius: '50%', // '50%' is safer than '75' for perfect circles
              objectFit: 'cover',
              marginBottom: 20,
              border: '4px solid white',
              // Optional: add a slight shadow to make it pop off the gradient
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          />
        )}

        {/* Highly recommended: Add the Club Name text below the logo */}
        <div
          style={{
            fontSize: 50,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '0 20px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)', // Adds readability over gradients
          }}
        >
          {clubData.name}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
