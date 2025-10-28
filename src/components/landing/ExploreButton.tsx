'use client';

import { DownArrowIcon } from '@src/icons/Icons';

const ExploreButton = () => {
  return (
    <button
      className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center"
      type="button"
      onClick={(e) => {
        e.preventDefault();
        document
          .getElementById('content')
          ?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      <p className="text-center text-lg text-white text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]">
        Explore Clubs
      </p>
      <DownArrowIcon className="drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]" />
    </button>
  );
};
export default ExploreButton;
