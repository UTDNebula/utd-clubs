import { eq } from 'drizzle-orm';
import { ImageResponse } from 'next/og';
import { db } from '@src/server/db';

// REMOVE THIS: import { TagChip } from '@src/components/common/TagChip';

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
                borderRadius: '0px', // '10%' works differently in some Satori versions, px is safer
                backgroundColor: 'rgba(220, 240, 255, 0.14)',
                border: '0px solid white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '70%',
                  height: '70%',
                  borderRadius: '0px', // '10%' works differently in some Satori versions, px is safer
                  backgroundColor: 'white',
                  border: '0px solid white',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={clubData.profileImage}
                  alt={clubData.name + ' logo'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
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
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            {clubData.name + ' - UTD CLUBS'}
          </h1>

          {/* Tags Container */}
          {clubData.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {clubData.tags.map((tag, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#d3caff', // Light Blue (adjust to match cornflower-100)
                    color: '#5455cc', // Dark Blue (adjust to match cornflower-600)
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '20px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
