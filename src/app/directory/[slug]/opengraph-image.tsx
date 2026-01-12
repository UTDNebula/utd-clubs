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
    new URL('../../opengraph-club-preview-bg.png', import.meta.url),
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
        {/* BG Gradient Image */}
        <img
          // @ts-expect-error ArrayBuffers are allowed as an img source
          src={gradientBuffer}
          alt="background gradient"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Makes a full circle always without distortion (crops)
            zIndex: -1,
          }}
        />

        {/* Profile Image */}
        {clubData.profileImage && (
          <div
            style={{
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              width: 400,
              height: 400,
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '6px solid white',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Profile Image */}
            <img
              src={clubData.profileImage}
              alt={clubData.name + ' logo'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Glossy Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)',
                borderRadius: '50%',
              }}
            />

            {/* Inset shadow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                boxShadow: 'inset 0 0 25px rgba(0,0,0,0.25)',
              }}
            />
          </div>
        )}
      </div>
    ),
    {
      ...size,
    },
  );
}
