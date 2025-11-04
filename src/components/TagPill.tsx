'use client';

import TagIcon from '@mui/icons-material/Tag';
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
      icon={<TagIcon color="inherit" />}
      className=" rounded-full font-bold transition-colors  text-white"
      color="primary"
      onClick={() => addTag(name)}
      onDelete={removeTag}
    />
  );
};
