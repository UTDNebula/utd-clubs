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
    with: {
      userMetadataToClubs: {
        columns: { userId: true },
      },
    },
  });

  const gradientBuffer = await fetch(
    new URL('../../../../public/images/landingGradient.png', import.meta.url),
  ).then((res) => res.arrayBuffer());

  const logoBuffer = await fetch(
    new URL('../../../../public/nebula-logo.png', import.meta.url),
  ).then((res) => res.arrayBuffer());

  const baiJamjureeBuffer = await loadGoogleFont('Bai Jamjuree', 700);
  const interBuffer = await loadGoogleFont('Inter', 600);

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
                borderRadius: '20px', // '10%' works differently in some Satori versions, px is safer
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
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: '0px', // '10%' works differently in some Satori versions, px is safer
              border: '0px solid white',
              overflow: 'hidden',
            }}
          >
            <img
              // @ts-expect-error ArrayBuffers are allowed as an img source
              src={logoBuffer}
              alt="background gradient"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: 'Bai Jamjuree',
              fontSize: '60px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              lineHeight: 1.1,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            {clubData.name}
          </h1>

          {/* Details Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignContent: 'center',
              width: '70%',
              fontFamily: 'Inter',
              fontSize: '20px',
              margin: '0 0 20px 0',
            }}
          >
            {clubData.userMetadataToClubs.length > 1 && (
              <>
                <div style={{ display: 'flex', margin: '0 10px 0 0' }}>
                  {clubData.userMetadataToClubs.length} members
                </div>
                <div
                  style={{
                    borderLeft: '2px solid white',
                    height: '70%',
                    margin: '4px 10px 0 0',
                  }}
                />
              </>
            )}
            <div style={{ display: 'flex' }}>Check it out on UTD CLUBS</div>
          </div>
          {clubData.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {clubData.tags.map((tag, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#d3caff',
                    color: '#573dff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '20px',
                    fontFamily: 'Inter',
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
    {
      ...size,
      fonts: [
        {
          name: 'Bai Jamjuree',
          data: baiJamjureeBuffer,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Inter',
          data: interBuffer,
          style: 'normal',
          weight: 600,
        },
      ],
    },
  );
}

async function loadGoogleFont(font: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`;
  const css = await fetch(url).then((res) => res.text());
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (!resource) {
    throw new Error('Failed to load font');
  }

  return fetch(resource[1]!).then((res) => res.arrayBuffer());
}
