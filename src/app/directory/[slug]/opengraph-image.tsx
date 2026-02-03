import { eq } from 'drizzle-orm';
import { ImageResponse } from 'next/og';
import { UTDClubsLogoStandalone } from '@src/icons/UTDClubsLogo';
import { db } from '@src/server/db';

export const runtime = 'edge';
export const alt = 'Club Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const slug = (await params).slug;

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

  const people_alt_icon_buffer = await fetch(
    new URL('../../../../public/icons/people_alt.png', import.meta.url),
  ).then((res) => res.arrayBuffer());

  const baiJamjureeBuffer = await loadGoogleFont('Bai Jamjuree', 700);
  const interBuffer = await loadGoogleFont('Inter', 600);

  const background = (
    // eslint-disable-next-line @next/next/no-img-element
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
      </div>,
      { ...size },
    );
  }

  const hasImage = !!clubData.profileImage;

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: hasImage ? 'space-between' : 'center',
        color: 'white',
      }}
    >
      {background}

      {/* Left Side (renders if there's an image) */}
      {hasImage && (
        <div
          style={{ display: 'flex', width: '45%', justifyContent: 'center' }}
        >
          <div
            style={{
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              width: 350,
              height: 350,
              borderRadius: '20px',
              boxShadow: '0 0 16px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clubData.profileImage!}
              alt={clubData.name + ' logo'}
              style={{
                width: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}

      {/* Right Side (Content) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '95%',
          alignItems: hasImage ? 'flex-start' : 'center',
          paddingRight: hasImage ? '40px' : '0px',
          paddingLeft: hasImage ? '0px' : '25px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Bai Jamjuree',
            fontSize: '60px',
            fontWeight: 'bold',
            margin: '0 0 20px 0',
            lineHeight: 1.1,
            textShadow: '0 0 16px rgba(0,0,0,0.4)',
            maxWidth: hasImage ? '55%' : '90%',
            textAlign: hasImage ? 'left' : 'center',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          {clubData.name}
        </h1>

        {/* Details Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: hasImage ? 'flex-start' : 'center',
            alignItems: 'center',
            width: '100%',
            fontFamily: 'Inter',
            fontSize: '25px',
            margin: '0 0 20px 0',
            gap: '12px',
          }}
        >
          {/* Number of members */}
          {clubData.userMetadataToClubs.length > 1 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 35,
                  height: 35,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  // @ts-expect-error ArrayBuffers are allowed
                  src={people_alt_icon_buffer}
                  alt="people icon"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  textShadow: '0 0 4px rgba(0,0,0,0.4)',
                }}
              >
                {clubData.userMetadataToClubs.length} followers
              </div>
              {/* Divider */}
              <div
                style={{
                  width: '2px',
                  height: '25px',
                  backgroundColor: '#d4d4d4',
                  margin: '0 10px 0 9px',
                  alignSelf: 'center',
                }}
              />
            </div>
          )}

          {/* Nebula Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
            }}
          >
            <UTDClubsLogoStandalone
              fill="white"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              textShadow: '0 0 4px rgba(0,0,0,0.4)',
            }}
          >
            UTD CLUBS
          </div>
        </div>

        {clubData.tags && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: hasImage ? 'flex-start' : 'center',
              width: hasImage ? '650px' : '900px', // explicit width helps Satori calculate wrapping
            }}
          >
            {clubData.tags.map((tag, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#d3caff',
                  color: '#573dff',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  fontSize: '20px',
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
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
