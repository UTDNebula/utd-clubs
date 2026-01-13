import { eq } from 'drizzle-orm';
import { ImageResponse } from 'next/og';
import { db } from '@src/server/db';

export const runtime = 'edge';
export const alt = 'Club Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const clubData = await db.query.club.findFirst({
    where: (club) => eq(club.slug, slug),
  });

  const gradientBuffer = await fetch(
    new URL('../../opengraph-club-preview-bg.png', import.meta.url),
  ).then((res) => res.arrayBuffer());

  const background = (
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
        objectFit: 'cover',
        // REMOVED zIndex: -1.
        // Placing this element first in the parent achieves the same effect in Satori.
      }}
    />
  );

  if (!clubData) {
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
          {background}
          <h1>Club Not Found</h1>
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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
        }}
      >
        {background}

        {/* Left Side */}
        <div
          style={{ display: 'flex', width: '45%', justifyContent: 'center' }}
        >
          {clubData.profileImage && (
            <div
              style={{
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                width: 350,
                height: 350,
                borderRadius: '10%',
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
                  borderRadius: '10%',
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
                  borderRadius: '10%',
                  boxShadow: 'inset 0 0 25px rgba(0,0,0,0.25)',
                }}
              />
            </div>
          )}
        </div>

        {/* Right Side */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '55%',
            paddingRight: '40px',
          }}
        >
          {/* Logo/Icon Placeholder */}
          <div
            style={{
              display: 'flex',
              alignSelf: 'center',
              fontSize: '40px',
              marginBottom: '20px',
            }}
          >
            ⚛️
          </div>

          <h1
            style={{
              fontSize: '50px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              lineHeight: 1.1,
            }}
          >
            {clubData.name + ' - UTD CLUBS'}
          </h1>

          {clubData.tags && (
            <p
              style={{
                fontSize: '30px',
                margin: '0 0 30px 0',
                opacity: 0.9,
              }}
            >
              adjfkldjf
            </p>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
