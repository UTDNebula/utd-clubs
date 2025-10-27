'use client';

import { useRouter } from 'next/navigation';
import { LeftArrowIcon, LeftChevronIcon } from '../icons/Icons';

export const BackButton = () => {
  const router = useRouter();
  return (
    <div className="flex h-min flex-row align-middle">
      <button
        onClick={() => router.back()}
        type="button"
        className="box-content h-fit w-fit rounded-full shadow-slate-500 hover:bg-white hover:shadow-xs transition-colors cursor-pointer"
        // className="box-content h-fit w-fit rounded-full shadow-slate-700 hover:bg-white transition-colors"
      >
        <LeftChevronIcon size={40} fill="fill-slate-500" />
      </button>
    </div>
  );
};

export const BlueBackButton = () => {
  const router = useRouter();
  return (
    <div className="flex h-min flex-row align-middle">
      <button
        onClick={() => router.back()}
        type="button"
        className="bg-blue-primary box-content h-fit w-fit rounded-full p-2 hover:bg-blue-700 active:bg-blue-800"
      >
        <LeftArrowIcon />
      </button>
    </div>
  );
};

export default BackButton;
