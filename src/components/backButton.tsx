'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import { LeftArrowIcon } from '../icons/Icons';

export const BackButton = ({ ...props }) => {
  const router = useRouter();
  return (
    <div className="flex h-min flex-row align-middle">
      <IconButton
        onClick={() => router.back()}
        size="large"
        color="primary"
        {...props}
      >
        <ArrowBackIcon />
      </IconButton>
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
