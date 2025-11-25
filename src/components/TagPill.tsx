'use client';

import Chip from '@mui/material/Chip';
import { useSearchStore } from '@src/utils/SearchStoreProvider';

export const TagPill = ({
  name,
  removeTag,
}: {
  name: string;
  removeTag?: () => void;
}) => {
  const addTag = useSearchStore((state) => state.addTag);
  return (
    <Chip
      label={`${name}`}
      className=" rounded-full font-bold transition-colors  text-white"
      color="primary"
      onClick={() => addTag(name)}
      onDelete={removeTag}
    />
  );
};
