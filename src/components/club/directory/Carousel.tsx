'use client';
import { LeftArrowIcon, RightArrowIcon } from '@src/icons/Icons';
import { type SelectClub } from '@src/server/db/models';
import Image from 'next/image';
import Link from 'next/link';
import { type TouchEventHandler, useState } from 'react';

const minSwipeDistance = 50;

type Props = { clubs: SelectClub[] };
const Carousel = ({ clubs }: Props) => {
  const [slide, setSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const onClick = (acc: 1 | -1) => {
    setSlide((prevSlide) => {
      const nextSlide = prevSlide + acc;
      if (nextSlide < 0) return clubs.length - 1;
      if (nextSlide >= clubs.length) return 0;
      return nextSlide;
    });
  };

  const handleTouchStart: TouchEventHandler = (e) => {
    if (!e.touches[0]) return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd: TouchEventHandler = (e) => {
    if (!e.changedTouches[0]) return;
    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchStart - touchEnd;

    if (swipeDistance > minSwipeDistance) onClick(1);
    else if (swipeDistance < -minSwipeDistance) onClick(-1);
  };

  const getSlideStyle = (key: number) => {
    const offset = key - slide;
    return {
      transform: `translateX(${offset * 100}%) scale(${
        offset === 0 ? 1 : 0.9
      })`,
      transition: 'transform 0.8s ease-out',
      boxShadow: offset === 0 ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
    };
  };

  return (
    <div className="mx-auto w-full touch-none">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex h-full w-full">
          {clubs.map((club, key) => (
            <Link
              className="absolute inset-0 h-full w-full"
              key={key}
              href={`/directory/${club.slug}`}
              style={getSlideStyle(key)}
            >
              <div className="relative h-full w-full">
                {club.profileImage ? (
                  <Image
                    src={club.profileImage}
                    alt="Picture of the club"
                    width={1920}
                    height={1080}
                    className="h-full w-full rounded-lg object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 h-full w-full bg-gray-200" />
                )}
                <div className="absolute inset-0 bg-black/5">
                  {' '}
                  <div className="absolute right-4 bottom-4 left-4 rounded-lg bg-black/50 p-2 sm:p-4 md:p-6">
                    <h1 className="text-lg font-bold text-white sm:text-xl md:text-3xl">
                      {club.name}
                    </h1>
                    <p className="mt-2 line-clamp-2 text-xs text-white sm:text-sm md:text-base">
                      {club.description}
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 m-5 rounded-full bg-black/50 p-2 font-extrabold text-white sm:p-3">
                  FEATURED CLUB
                </div>
              </div>
            </Link>
          ))}
        </div>
        {clubs.length > 1 && (
          <div className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-between px-4 sm:px-6 md:px-10">
            <button
              className="pointer-events-auto flex items-center justify-center rounded-full bg-black/70 p-2 transition-all duration-300 hover:scale-110 hover:bg-black/80 sm:p-3 md:p-4"
              onClick={() => onClick(-1)}
            >
              <LeftArrowIcon />
            </button>
            <button
              className="pointer-events-auto flex items-center justify-center rounded-full bg-black/70 p-2 transition-all duration-300 hover:scale-110 hover:bg-black/80 sm:p-3 md:p-4"
              onClick={() => onClick(1)}
            >
              <RightArrowIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;
