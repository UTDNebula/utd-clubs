import { and, eq } from 'drizzle-orm';
import { ImageResponse } from 'next/og';
import { UTDClubsLogoStandalone } from '@src/icons/UTDClubsLogo';
import { db } from '@src/server/db';
import { addVersionToImage } from '@src/utils/imageCacheBust';

export const runtime = 'edge';
export const alt = 'Event Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function formatEventDate(startTime: Date, endTime: Date): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const startDate = startTime.toLocaleDateString('en-US', dateOptions);
  const startTimeStr = startTime.toLocaleTimeString('en-US', timeOptions);
  const endTimeStr = endTime.toLocaleTimeString('en-US', timeOptions);

  const sameDay = startTime.toDateString() === endTime.toDateString();
  if (sameDay) {
    return `${startDate}, ${startTimeStr} - ${endTimeStr}`;
  }
  const endDate = endTime.toLocaleDateString('en-US', dateOptions);
  return `${startDate}, ${startTimeStr} - ${endDate}, ${endTimeStr}`;
}

export default async function Image({ params }: { params: { id: string } }) {
  const id = (await params).id;

  const eventData = await db.query.events.findFirst({
    where: (events) => and(eq(events.id, id), eq(events.status, 'approved')),
    with: {
      club: {
        columns: { name: true, profileImage: true, updatedAt: true },
      },
    },
  });

  const gradientBuffer = await fetch(
    new URL('../../../../public/images/landingGradient.png', import.meta.url),
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

  if (!eventData) {
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
        <h1>Event Not Found</h1>
      </div>,
      { ...size },
    );
  }

  const hasImage = !!eventData.image;
  const dateStr = formatEventDate(eventData.startTime, eventData.endTime);

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

      {/* Left Side (renders if there's an event image) */}
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
            <img
              src={addVersionToImage(
                eventData.image!,
                eventData.updatedAt.getTime(),
              )}
              alt={eventData.name + ' event image'}
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
            fontSize: '56px',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
            lineHeight: 1.1,
            textShadow: '0 0 16px rgba(0,0,0,0.4)',
            maxWidth: hasImage ? '55%' : '90%',
            textAlign: hasImage ? 'left' : 'center',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            overflow: 'hidden',
            maxHeight: '200px',
          }}
        >
          {eventData.name}
        </h1>

        {/* Date & Time */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'Inter',
            fontSize: '24px',
            margin: '0 0 12px 0',
            textShadow: '0 0 4px rgba(0,0,0,0.4)',
            maxWidth: hasImage ? '55%' : '90%',
            textAlign: hasImage ? 'left' : 'center',
          }}
        >
          {dateStr}
        </div>

        {/* Location */}
        {eventData.location && (
          <div
            style={{
              display: 'flex',
              fontFamily: 'Inter',
              fontSize: '22px',
              margin: '0 0 16px 0',
              textShadow: '0 0 4px rgba(0,0,0,0.4)',
              opacity: 0.9,
              maxWidth: hasImage ? '55%' : '90%',
              textAlign: hasImage ? 'left' : 'center',
            }}
          >
            {eventData.location}
          </div>
        )}

        {/* Details Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: hasImage ? 'flex-start' : 'center',
            alignItems: 'center',
            width: '100%',
            fontFamily: 'Inter',
            fontSize: '22px',
            margin: '0 0 16px 0',
            gap: '12px',
          }}
        >
          {/* Club name */}
          {eventData.club.profileImage && (
            <div
              style={{
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                overflow: 'hidden',
              }}
            >
              <img
                src={addVersionToImage(
                  eventData.club.profileImage,
                  eventData.club.updatedAt?.getTime(),
                )}
                alt={eventData.club.name + ' logo'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}
          <div
            style={{
              display: 'flex',
              textShadow: '0 0 4px rgba(0,0,0,0.4)',
            }}
          >
            {eventData.club.name}
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

          {/* Nebula Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
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
