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
      className="bg-blue-primary rounded-full font-bold transition-colors hover:bg-blue-700 text-white"
      onClick={() => addTag(name)}
      onDelete={removeTag}
    />
  );
};
