'use client';

import { useRouter } from 'next/navigation';

import { LeftArrowIcon } from '../icons/Icons';

const BackButton = () => {
  const router = useRouter();
  return (
    <div className="flex h-min flex-row align-middle">
      <button
        onClick={() => router.back()}
        type="button"
        className="group box-content h-fit w-fit rounded-full bg-white p-2.5 shadow-xs shadow-slate-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.0825 14.0925H10.9125L15.7925 9.21249C16.1825 8.82249 16.1825 8.18249 15.7925 7.79249C15.6057 7.60523 15.352 7.5 15.0875 7.5C14.823 7.5 14.5693 7.60523 14.3825 7.79249L7.7925 14.3825C7.4025 14.7725 7.4025 15.4025 7.7925 15.7925L14.3825 22.3825C14.7725 22.7725 15.4025 22.7725 15.7925 22.3825C16.1825 21.9925 16.1825 21.3625 15.7925 20.9725L10.9125 16.0925H22.0825C22.6325 16.0925 23.0825 15.6425 23.0825 15.0925C23.0825 14.5425 22.6325 14.0925 22.0825 14.0925Z"
            className="fill-blue-primary transition-colors group-hover:fill-blue-700 group-active:bg-blue-800"
          />
        </svg>
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
